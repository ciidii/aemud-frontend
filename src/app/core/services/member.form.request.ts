export interface MemberFormRequest {
  id: string
  personalInfo: {
    name: string;
    firstname: string;
    nationality: string;
    birthday: string;
    maritalStatus: ""
  },
  membershipInfo: {
    yearOfBac: string;
    bacSeries: string;
    bacMention: string;
    legacyInstitution: string;
    aemudCourses: string;
    otherCourses: string;
    participatedActivity: string;
    politicOrganisation: string;
    commission: [],
    clubs: [],
    bourse: string;

  },
  academicInfo: {},
  addressInfo: {},
  contactInfo: {},
  bourseId: { bourseId: {} },
  clubsId: [{ id: {} }],
  commissionsId: [{ id: {} }]
}
