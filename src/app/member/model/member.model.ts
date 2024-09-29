import {ClubModel} from "./club.model";
import {CommissionModel} from "./commission.model";
import {YearOfMembeship} from "../../core/models/yearOfMembeship";
import {BourseModel} from "../../core/models/bourses/bourse.model";

export class MemberModel {
  id!:number
  name!: string
  firstname!: string
  nationality!: string
  birthday!: string
  maritalStatus!: string
  addressInDakar!: string
  holidayAddress!: string
  numberPhone!: string
  email!: string
  personToCall!: string
  faculty!: string
  departmentOrYear!: string
  bourse!: BourseModel
  doYouParticipateAemudActivity!: string
  participatedActivity!: string
  addressToCampus!:string
  doYouParticipateAemudCourse!: string
  aemudCourseParticipated!: string
  doYouParticipatedOtherCourse!: string
  otherCourseParticipated!: string
  areYouMemberOfPoliticOrganisation!: string
  politicOrganisation!: string
  yearOfMembership!: YearOfMembeship
  twinsName!: string
  commission!: CommissionModel
  clubs!: ClubModel[]
  pay!: string
}
