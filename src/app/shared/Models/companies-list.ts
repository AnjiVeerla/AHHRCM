export interface CompaniesList {
    CompanyId: number;
    CompanyCode: string;
    CompanyName: string;
    CompanyName2L: string;
    Blocked: number;
}

export interface IcompanyInfo {
    CompanyID: number;
    CompanyCode: string;
    CompanyName: string;
    CompanyName2L: string;
    CompanyTypeId: number;
    Address1: string;
    Address2: string;
    CityId: number;
    PinCode: string;
    PhoneNo: string;
    MobileNo: string;
    Fax: string;
    Email: string;
    CreditDays: number;
    LicenseNo: string;
    UserID: number;
    WorkStationID: number;
    Blocked: number;
    CountryId: number;
    CityName: string;
    CountryName: string;
    CompanyType: string;
}


export interface searchData {
    type: string; 
    value: string; 
    dbFieldName: string
}