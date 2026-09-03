export interface MandateKpiTarget {
  id?: string;
  mandatId: string;
  cibleAdherentsActifs: number;
  cibleCollecteCotisations: number;
  cibleFraisAdhesion: number;
  cibleMecenatAlumni: number;
  tauxRetentionCible: number; // percentage (ex: 85%)
}

export interface MandateKpiProgress {
  kpi: MandateKpiTarget;
  realiseAdherentsActifs: number;
  realiseCollecteCotisations: number;
  realiseFraisAdhesion: number;
  realiseMecenatAlumni: number;
  tauxRetentionReel: number;
}
