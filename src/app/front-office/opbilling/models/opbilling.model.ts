export class OutPatientBill {
    UHID?:string;
    PatientID?:string;
    UserID?:number;
    WorkstationID?:number;
    LocationID?:number; 
    BillType?:string; 
    DoctordID?:number; 
    SpID?:number; 
    CompanyID?:number; 
    GradeID?:number; 
    LetterID?:number; 
    IPid?:number; 
    IsDefaultLOA?:any
    GradeSpecialiseID?:number; 
    PatientType?:number; 
    outPatientTempDetails?:OutPatientTemp[];
    GradeName?: any;
    ScanDocumentPath?: any;
    NationalIDPath?: any;
    SessionID?: any;
    SelectedService?: string;
    discountList?: BillGroup[];
    isAvailDeposit?: boolean;
    availDiscounts?: boolean;
  } 
export class OutPatientTemp {
    serviceName?: string;
    serviceId?: number;
    procedure?: string;
    procedureId?: number;
    sample?: string;
    sampleId?: number;
    deptId?:number;
    deptName?: string;
    bedTypeId?: number;
    bedTypeName?: string;
    specialiseId?: number;
    specialiseName?: string;
    orderNo?: string;
    orderDate?: string;
    isGroup?: boolean;
    quantity?: number;
    amount?: number;
    PPAY?: number;
    CPAY?: number;
    SPAY?: number;
    seq?: string;
    profileId?: number;
    tariffId?: number;
    MQTY?: number;
    SQTY?: number;
    status?: number; 
    scheduleId?: number;
    procId?: number;
    basePrice?: number;
    billablePrice?: number;
    eligiblePrice?: number;
    pAmount?: number;
    unitRate?: number;
    orderId?: number;
    price?: number; 
    DPAY?: number;
    dAmount?: number;
    serviceTypeID?: number;
    patientType?: number;
    orderItemID?: number;
    priority?: number;
    claimStatusnidhi ?: number;  
    VAT?: number;
    VATAmount?: number;
    CVAT?: number;
    OPPackAssignID?: number;
    PVAT?: number;  
    batchID?: number;
  }
  export class BillGroup {
    billNO?: number;
    billDate?: Date;
    patientName?: string;
    age?: number;
    genderId?: number;
    gender?: string;
    patientId?: number;
    admissionNumber?: number;
    regCode?: number;
    patientAmount?: number;
    companyAmount?: number;
    patientDiscount?: number;
    companyDiscount?: number;
    billEntryId?: number;
    typeName?: string;
    userId?: number;
    hospitalID?: number;
    hospitalName?: string;
    serviceID?: string;
    serviceName?: string;
    SERID?: string;
    hospDeptName?: string;
    HDEPTID?: string;
    ITID?: string;
    specialization?: string;
    ServiceItemName?: string;
    serviceItemID?: string;
    SPECID?: string;
    configuration?: string;
    totalReceipt?: number;
    discountper?: number;
    discountamount?: number;
    discountId?: number;
    billId?: number;
    tbl?: string;
    discAmount?: number;
    discountName?: string;
    authenticatedUserID?: number;
    AuthorisedBy?: string;
    userName?: string;
    discountPercentage?: string;
    discountAmt?: string;
    isPasswordRequired?: number;
    sidUserName?: string;
    reason?: string;
    hospDeptId?: string;
    departmentName?: string;
    specialiseId?: string;
    specialisation?: string;
    itemId?: string;
    name?: string;
    isContribution?: string;
    ppay?: string;
    mLevel?: string;
    orderId?: string;
    SEQ?: string;
    BILLID?: string;
    BILLITEMID?: string;
    TYP?: string;
    SID?: string;
    DID?: string;
    SPID?: string;
    specializationName?: string;
    SIID?: string;
    itemName?: string;
    TOT?: string;
    CPAY?: any;
    PPAY?: any;
    DCOM?: any;
    DPAT?: any;
    DIS?: string;
    DPER?: string;
    QTY?: string;
    BQTY?: string;
    CVAT?: string;
    PVAT?: String;
    VAT?: string;
    AUTHORISEDBY?: string;
    AUTHORISEDID?: string;
    REMARKS?: string;
    ORDERID?: string;
    value?: string;
    discountDate ?: string;
    Level ?: string;
    cpay ?: string;
    sequence?: string;
    discount?: string;
    bqty?: string;
    orderID?: string;
  discountTypeId?: any;
}
export class ConsultantDetails{
    code?: string;
    departmentName?: string;
    empId?: number;
    hospDeptId?: number;
    name?:string;
    orderType?: string;
    orderTypeId?: number;
    patientType?: number;
    procedureId?: number;
    service?: string;
    serviceId?: number;
    serviceTypeId?:  number;
    specialisation?: string;
    specialiseId?: number;
    quantity?:number;
    price:any;
      sampleId: any;
      deptId: any;
    
    }

    export class SaveBill {
        UHID?:string;
        PatientID?:string;
        UserID?:number;
        WorkstationID?:number;
        LocationID?:number; 
        BillType?:string; 
        DoctordID?:number; 
        SpID?:number; 
        CompanyID?:number; 
        GradeID?:number; 
        LetterID?:number; 
        IPid?:number; 
        IsDefaultLOA?:any
        GradeSpecialiseID?:number; 
        PatientType?:number;   
        GradeName?: any;
        SessionID?: any;
        outPatientTempDetails?:OutPatientTemp[];
        summaryTableDetails?:SummaryTable[];
        creditBillDetails?:CreditBillDetail[];
        creditBillContributions?: CreditBillContribution[];
        discountDetails?:any[];
        billPackageItems?:any[];
        TariffID?: number;
        ReferalDoctorID?: number;
        billDetails?: any[];
        letterID?: any;
        isDefaultLOA?: any;
        parentLetterId?: any;
        saveDefaultLOA?: any;
        parrentLetterID?: any;
        billSummary?: any;
        DoctorID?: any;
        collectableType?: any;
        cpayAfterVAT?: any;
        ppayAfterVAT?: any;
        actualAmount?: any;
        maxCollectable?: any;
        vatAmount?: any;
        pvatValue?: any;
        cvatValue?: any;
        discountData?: any;
        discountID?: number;
        availDiscounts?: boolean;
        availDeposit?: number;
        isAvailDeposit?: boolean;
        discountLevel?: any;
      }
      export class SummaryTable{
        modeId:any;
        bankID:any;
        cardTypeID:any;
        approvalNo:any;
        number:any;
        TDate:any;
        validity:any;
        voucherNameID:any;
        voucherName:any;
        cardHolderName:any;
        EDCMachine:any;
        amount:any;
        modeOfPayment:any;
        referenceNo:any;
      }
      export class CreditBillDetail
{
      amount?:number; 
      cPAY ?:number;
      dPAY ?:number;
      pPAY ?:number;
      sPAY ?:number; 
      maxCollectables?:number;  
      collectableType?:number; 
      tempAmount ?:number ;
      credit ?:number; 
      discount ?:number ;
      depositAmount ?:number ;
      boolBoth ?:boolean;
}

export class CreditBillContribution
{
     SID ?:number; 
     SIID ?:number; 
     DID ?:number; 
     SPID ?:number; 
     Quantity ?:number; 
     TOT ?:number; 
     PPAY ?:number; 
     CPAY ?:number; 
     SPAY ?:number; 
     Seq ?:string;
     MQTY ?:number; 
     SQTY ?:number; 
     Status ?:number; 
     ScheduleId ?:number; 
     PRID?:number;  
     BasePrice ?:number; 
     BillablePrice?:number; 
     EligiblePrice ?:number; 
     PAmount ?:number; 
     UnitRate ?:number; 
     OrderId ?:number; 
     Price ?:number; 
     DPAY ?:number; 
     DAmount ?:number; 
     ServiceTypeID ?:number; 
     PatientType ?:number; 
     OrderItemID ?:number; 
     Priority ?:number; 
     ClaimStatusnidhi ?:number;  
     VAT ?:number; 
     VATAmount ?:number; 
     CVAT ?:number; 
     OPPackAssignID ?:number; 
     PVAT ?:number; 
     BatchID ?:number; 
     IsSaudi?:boolean;
     GradeID ?:number; 
     ISOPPackage ?:number; 
     DType ?:number; 
     DTypeValue ?:number; 
     TransType ?:number; 
     TYP ?:number;  
     mBillFlag?:number;  
     mDedLTID ?:number; 
     mDedLimitAmt ?:boolean;
     mDedLimitType?:number;  
     DCOM ?:number;  
     DPAT ?:number;  
     DIS ?:number;  
     DPER ?:number;  

}
export class PaymentDetails {
  BID?: string;//Bank Id
  CID?: string;//Card Type Id
  PMID?: string;//Payment Mode Id
  EDATE?: string;
  ET?: string;
  AMT?: string;
  TNO?: string = '';//transaction No
  CNO?: string;//card no
  TDATE?: string;
  VTO?: string;//Validity
  CON?: string; //paid By
  REM?: string; //Remarks
  ORINT?: string;
  CTYPE?: string;//Card Type
  VID?: string;//Voucher Id
  VNAME?: string;//Voucher Name
  CHOL?: string;
  EDCM?: string;//EDC Machine
  CUID?: string;
  CURS?: string;
  CAMT?: string;
  ModeofPayment?: string;
  id?:any;
}