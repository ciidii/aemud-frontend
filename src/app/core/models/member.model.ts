export interface MemberModel {
    id: string;
    personalInfo: {
        name: string;
        firstname: string;
        nationality: string;
        gender: string;
        birthday: number[];
        maritalStatus: string;
    };
    membershipInfo: {
        legacyInstitution: string;
        bacSeries: string;
        bacMention: string;
        yearOfBac: string;
        aemudCourses: string;
        otherCourses: string;
        participatedActivity: string;
        politicOrganisation: string;
    };
    academicInfo: {
        institutionName: string;
        studiesDomain: string;
        studiesLevel: string;
    };
    addressInfo: {
        addressInDakar: string;
        holidayAddress: string;
        addressToCampus: string;
    };
    contactInfo: {
        numberPhone: string;
        email: string;
        personToCalls: Array<{
            lastname: string;
            firstname: string;
            requiredNumberPhone: string;
            optionalNumberPhone: string;
            relationship: string;
        }>;
    };
    bourse: {
        bourseId: string;
        lebelle: string;
        montant: number;
    };
    clubs: Array<{
        id: string;
        name: string;
    }>;
    commissions: Array<{
        id: string;
        name: string;
    }>;
}

export interface ApiResponse {
    records: number;
    items: MemberModel[];
    pages: number;
    page: number;
    record_from: number;
    record_to: number;
}
