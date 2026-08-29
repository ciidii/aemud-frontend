import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {
  FieldCategory,
  FieldType,
  FormFieldDefinition,
  FormGroupDefinition,
  FormSchema
} from '../../../core/models/form-schema.model';
import {FormSchemaService} from '../../../core/services/form-schema.service';
import {DynamicFormComponent} from '../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-form-schema-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './form-schema-admin.component.html',
  styleUrls: ['./form-schema-admin.component.scss']
})
export class FormSchemaAdminComponent implements OnInit {
  schema: FormSchema | null = null;
  isLoading: boolean = true;
  isSaving: boolean = false;
  isPreviewModalOpen: boolean = false;

  // --- Modals State ---
  isAddFieldModalOpen: boolean = false;
  isAddGroupModalOpen: boolean = false;

  // --- New Field State ---
  selectedGroupCode: string = '';
  newField: {
    key: string;
    label: string;
    type: FieldType;
    isRequired: boolean;
    placeholder: string;
    optionsInput: string;
    options: string[];
  } = this.getEmptyNewField();

  editingField: {
    groupCode: string;
    field: FormFieldDefinition;
    optionsInput: string;
  } | null = null;

  // --- New / Edit Group State ---
  newGroup: {
    title: string;
    description: string;
    visibilityTarget: 'ALL' | 'STUDENT' | 'ALUMNI';
  } = {
    title: '',
    description: '',
    visibilityTarget: 'ALL'
  };

  editingGroup: {
    group: FormGroupDefinition;
    title: string;
    description: string;
    visibilityTarget: 'ALL' | 'STUDENT' | 'ALUMNI';
  } | null = null;

  availableFieldTypes: {value: FieldType; label: string}[] = [
    {value: 'TEXT', label: 'Texte court'},
    {value: 'TEXTAREA', label: 'Texte long (Zone de texte)'},
    {value: 'NUMBER', label: 'Nombre'},
    {value: 'BOOLEAN', label: 'Bouton interrupteur (Oui/Non)'},
    {value: 'DATE', label: 'Date'},
    {value: 'SELECT', label: 'Liste déroulante (Choix unique)'},
    {value: 'MULTI_SELECT', label: 'Choix multiples (Cases à cocher)'},
    {value: 'RADIO', label: 'Boutons radio (Choix unique)'}
  ];

  constructor(
    private formSchemaService: FormSchemaService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSchema();
  }

  loadSchema(): void {
    this.isLoading = true;
    this.formSchemaService.getFormSchema().subscribe({
      next: (data: FormSchema) => {
        this.schema = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Impossible de charger le schéma du formulaire.', 'Erreur');
        this.isLoading = false;
      }
    });
  }

  saveSchema(): void {
    if (!this.schema) return;

    this.isSaving = true;
    this.formSchemaService.updateFormSchema(this.schema).subscribe({
      next: (updated: FormSchema) => {
        this.schema = updated;
        this.isSaving = false;
        this.toastr.success('Schéma de formulaire enregistré avec succès !', 'Succès');
      },
      error: (err: any) => {
        this.isSaving = false;
        const msg = err.error?.message || 'Erreur lors de la sauvegarde du schéma.';
        this.toastr.error(msg, 'Erreur');
      }
    });
  }

  resetToDefault(): void {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire aux valeurs d\'usine officielles ? Tous les groupes et champs personnalisés seront réinitialisés.')) {
      return;
    }

    this.isSaving = true;
    this.formSchemaService.resetFormSchema().subscribe({
      next: (resetSchema: FormSchema) => {
        this.schema = resetSchema;
        this.isSaving = false;
        this.toastr.success('Formulaire réinitialisé aux valeurs d\'usine.', 'Réinitialisation');
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Impossible de réinitialiser le schéma.', 'Erreur');
      }
    });
  }

  // ================= GESTION DES GROUPES (SECTIONS) =================

  openAddGroupModal(): void {
    this.newGroup = {
      title: '',
      description: '',
      visibilityTarget: 'ALL'
    };
    this.isAddGroupModalOpen = true;
  }

  closeAddGroupModal(): void {
    this.isAddGroupModalOpen = false;
  }

  submitNewGroup(): void {
    if (!this.newGroup.title || this.newGroup.title.trim() === '') {
      this.toastr.warning('Veuillez renseigner le nom de la section.', 'Validation');
      return;
    }

    if (!this.schema) return;

    const baseCode = this.slugify(this.newGroup.title).toUpperCase() || 'CUSTOM_GRP';
    let uniqueCode = baseCode;
    let counter = 1;
    while (this.schema.groups.some(g => g.code === uniqueCode)) {
      uniqueCode = `${baseCode}_${counter++}`;
    }

    let visibilityCondition: any = undefined;
    if (this.newGroup.visibilityTarget === 'STUDENT') {
      visibilityCondition = {dependsOn: 'isStudent', equals: true};
    } else if (this.newGroup.visibilityTarget === 'ALUMNI') {
      visibilityCondition = {dependsOn: 'isStudent', equals: false};
    }

    const groupToAdd: FormGroupDefinition = {
      id: 'grp-' + uniqueCode.toLowerCase() + '-' + Date.now(),
      code: uniqueCode,
      title: this.newGroup.title.trim(),
      description: this.newGroup.description?.trim() || undefined,
      order: this.schema.groups.length + 1,
      isActive: true,
      visibilityCondition,
      fields: []
    };

    this.schema.groups.push(groupToAdd);
    this.closeAddGroupModal();
    this.toastr.success(`Section "${groupToAdd.title}" créée avec succès. Vous pouvez y ajouter des champs.`, 'Section Ajoutée');
  }

  openEditGroupModal(group: FormGroupDefinition): void {
    let visibilityTarget: 'ALL' | 'STUDENT' | 'ALUMNI' = 'ALL';
    if (group.visibilityCondition?.dependsOn === 'isStudent') {
      visibilityTarget = group.visibilityCondition.equals === true ? 'STUDENT' : 'ALUMNI';
    }

    this.editingGroup = {
      group,
      title: group.title,
      description: group.description || '',
      visibilityTarget
    };
  }

  closeEditGroupModal(): void {
    this.editingGroup = null;
  }

  submitEditGroup(): void {
    if (!this.editingGroup || !this.schema) return;

    if (!this.editingGroup.title || this.editingGroup.title.trim() === '') {
      this.toastr.warning('Le titre de la section est obligatoire.', 'Validation');
      return;
    }

    this.editingGroup.group.title = this.editingGroup.title.trim();
    this.editingGroup.group.description = this.editingGroup.description.trim() || undefined;

    if (this.editingGroup.visibilityTarget === 'STUDENT') {
      this.editingGroup.group.visibilityCondition = {dependsOn: 'isStudent', equals: true};
    } else if (this.editingGroup.visibilityTarget === 'ALUMNI') {
      this.editingGroup.group.visibilityCondition = {dependsOn: 'isStudent', equals: false};
    } else {
      this.editingGroup.group.visibilityCondition = undefined;
    }

    this.closeEditGroupModal();
    this.toastr.info('Section modifiée. Pensez à enregistrer vos modifications.', 'Modifié');
  }

  deleteGroup(group: FormGroupDefinition): void {
    if (this.isCoreGroup(group)) {
      this.toastr.error('Cette section contient des informations système indispensables et ne peut pas être supprimée.', 'Action Interdite');
      return;
    }

    if (!confirm(`Confirmez-vous la suppression de la section "${group.title}" et de tous ses champs associés ?`)) {
      return;
    }

    if (!this.schema) return;

    this.schema.groups = this.schema.groups.filter(g => g.code !== group.code);
    this.reindexGroups();
    this.toastr.warning(`Section "${group.title}" supprimée.`, 'Suppression');
  }

  isCoreGroup(group: FormGroupDefinition): boolean {
    return group.fields.some(f => f.category === 'CORE');
  }

  moveGroupUp(index: number): void {
    if (!this.schema || index <= 0) return;
    const temp = this.schema.groups[index];
    this.schema.groups[index] = this.schema.groups[index - 1];
    this.schema.groups[index - 1] = temp;
    this.reindexGroups();
  }

  moveGroupDown(index: number): void {
    if (!this.schema || index >= this.schema.groups.length - 1) return;
    const temp = this.schema.groups[index];
    this.schema.groups[index] = this.schema.groups[index + 1];
    this.schema.groups[index + 1] = temp;
    this.reindexGroups();
  }

  private reindexGroups(): void {
    if (!this.schema) return;
    this.schema.groups.forEach((g, idx) => {
      g.order = idx + 1;
    });
  }

  // ================= GESTION DES CHAMPS =================

  openAddFieldModal(groupCode?: string): void {
    this.selectedGroupCode = groupCode || (this.schema?.groups[0]?.code || '');
    this.newField = this.getEmptyNewField();
    this.isAddFieldModalOpen = true;
  }

  closeAddFieldModal(): void {
    this.isAddFieldModalOpen = false;
  }

  onLabelChange(): void {
    if (!this.newField.key || this.newField.key.trim() === '') {
      this.newField.key = this.slugify(this.newField.label);
    }
  }

  submitNewField(): void {
    if (!this.newField.label || !this.selectedGroupCode) {
      this.toastr.warning('Veuillez renseigner le libellé de la question.', 'Validation');
      return;
    }

    const group = this.schema?.groups.find((g: FormGroupDefinition) => g.code === this.selectedGroupCode);
    if (!group) return;

    let autoKey = this.newField.key?.trim();
    if (!autoKey) {
      autoKey = this.slugify(this.newField.label);
    }
    if (!autoKey) {
      autoKey = 'field_' + Date.now();
    }

    // Parse options if SELECT, RADIO, MULTI_SELECT
    let parsedOptions: string[] | undefined = undefined;
    if (['SELECT', 'RADIO', 'MULTI_SELECT'].includes(this.newField.type)) {
      parsedOptions = this.newField.optionsInput
        .split('\n')
        .map((o: string) => o.trim())
        .filter((o: string) => o.length > 0);
    }

    const fieldToAdd: FormFieldDefinition = {
      key: autoKey,
      label: this.newField.label.trim(),
      category: 'CUSTOM',
      type: this.newField.type,
      isRequired: this.newField.isRequired,
      placeholder: this.newField.placeholder?.trim() || undefined,
      options: parsedOptions,
      order: group.fields.length + 1
    };

    group.fields.push(fieldToAdd);
    this.closeAddFieldModal();
    this.toastr.info(`Question "${fieldToAdd.label}" ajoutée. N'oubliez pas d'enregistrer les modifications.`, 'Ajouté');
  }

  openEditFieldModal(groupCode: string, field: FormFieldDefinition): void {
    this.editingField = {
      groupCode,
      field: JSON.parse(JSON.stringify(field)),
      optionsInput: field.options ? field.options.join('\n') : ''
    };
  }

  closeEditFieldModal(): void {
    this.editingField = null;
  }

  submitEditField(): void {
    if (!this.editingField || !this.schema) return;

    const group = this.schema.groups.find((g: FormGroupDefinition) => g.code === this.editingField!.groupCode);
    if (!group) return;

    const index = group.fields.findIndex((f: FormFieldDefinition) => f.key === this.editingField!.field.key);
    if (index !== -1) {
      if (['SELECT', 'RADIO', 'MULTI_SELECT'].includes(this.editingField.field.type)) {
        this.editingField.field.options = this.editingField.optionsInput
          .split('\n')
          .map((o: string) => o.trim())
          .filter((o: string) => o.length > 0);
      }
      group.fields[index] = this.editingField.field;
      this.toastr.info('Question modifiée.', 'Modifié');
    }

    this.closeEditFieldModal();
  }

  deleteField(group: FormGroupDefinition, field: FormFieldDefinition): void {
    if (field.category === 'CORE') {
      this.toastr.error('Les champs Système indispensables ne peuvent pas être supprimés.', 'Action Interdite');
      return;
    }

    if (!confirm(`Confirmez-vous la suppression de la question "${field.label}" ?`)) {
      return;
    }

    group.fields = group.fields.filter((f: FormFieldDefinition) => f.key !== field.key);
    this.toastr.warning(`Question "${field.label}" supprimée de la section.`, 'Suppression');
  }

  moveFieldUp(group: FormGroupDefinition, index: number): void {
    if (index <= 0) return;
    const temp = group.fields[index];
    group.fields[index] = group.fields[index - 1];
    group.fields[index - 1] = temp;
    this.reindexFields(group);
  }

  moveFieldDown(group: FormGroupDefinition, index: number): void {
    if (index >= group.fields.length - 1) return;
    const temp = group.fields[index];
    group.fields[index] = group.fields[index + 1];
    group.fields[index + 1] = temp;
    this.reindexFields(group);
  }

  private reindexFields(group: FormGroupDefinition): void {
    group.fields.forEach((f: FormFieldDefinition, idx: number) => {
      f.order = idx + 1;
    });
  }

  // --- Prévisualisation ---
  openPreviewModal(): void {
    this.isPreviewModalOpen = true;
  }

  closePreviewModal(): void {
    this.isPreviewModalOpen = false;
  }

  // --- Utilitaires ---
  private getEmptyNewField() {
    return {
      key: '',
      label: '',
      type: 'TEXT' as FieldType,
      isRequired: false,
      placeholder: '',
      optionsInput: '',
      options: []
    };
  }

  // --- Libellés Métier Accessibles & Non Techniques ---
  getCategoryLabel(category: FieldCategory): string {
    switch (category) {
      case 'CORE':
        return 'Système';
      case 'PRESET':
        return 'Standard';
      case 'CUSTOM':
        return 'Personnalisé';
      default:
        return category;
    }
  }

  getTypeLabel(type: FieldType): string {
    switch (type) {
      case 'TEXT':
        return 'Texte court';
      case 'TEXTAREA':
        return 'Texte long';
      case 'NUMBER':
        return 'Nombre';
      case 'BOOLEAN':
        return 'Oui / Non';
      case 'DATE':
        return 'Date';
      case 'SELECT':
        return 'Liste déroulante';
      case 'MULTI_SELECT':
        return 'Choix multiples';
      case 'RADIO':
        return 'Choix unique';
      default:
        return type;
    }
  }

  getVisibilityConditionLabel(condition: any): string {
    if (!condition) return '';
    if (condition.dependsOn === 'isStudent') {
      return condition.equals === true
        ? 'Visible pour les étudiants'
        : 'Visible pour les diplômés (Alumni)';
    }
    return `Condition : ${condition.dependsOn} = ${condition.equals}`;
  }

  private slugify(text: string): string {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/\s+/g, '');
  }
}
