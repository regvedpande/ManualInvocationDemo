export const invocations = [
  {
    id: "INV-001", requestDate: "2025-04-01", clientName: "Rajesh Kumar", pan: "ABCDE1234F",
    isin: "INE002A01018", scripName: "Reliance Industries", quantity: 500, cmp: 2850.00,
    loanCode: "LC-9821", product: "LAP", utr: "UTR20250401001",
    pledgerDpId: "12081800", pledgerClientId: "1208180056",
    status: "Pending Maker", remarks: "", file: "pledge_doc_001.pdf"
  },
  {
    id: "INV-002", requestDate: "2025-04-02", clientName: "Priya Sharma", pan: "FGHIJ5678K",
    isin: "INE040A01034", scripName: "HDFC Bank", quantity: 200, cmp: 1620.50,
    loanCode: "LC-9822", product: "SME", utr: "UTR20250402002",
    pledgerDpId: "12081801", pledgerClientId: "1208180157",
    status: "Pending Checker", remarks: "Verified by maker", file: "pledge_doc_002.pdf"
  },
  {
    id: "INV-003", requestDate: "2025-04-02", clientName: "Amit Patel", pan: "KLMNO9012P",
    isin: "INE001A01036", scripName: "TCS", quantity: 150, cmp: 3780.00,
    loanCode: "LC-9823", product: "LAP", utr: "UTR20250402003",
    pledgerDpId: "12081802", pledgerClientId: "1208180258",
    status: "Pending Risk", remarks: "Checker approved", file: "pledge_doc_003.pdf"
  },
  {
    id: "INV-004", requestDate: "2025-04-03", clientName: "Neha Singh", pan: "PQRST3456U",
    isin: "INE030A01027", scripName: "Infosys", quantity: 300, cmp: 1495.25,
    loanCode: "LC-9824", product: "CC", utr: "UTR20250403004",
    pledgerDpId: "12081803", pledgerClientId: "1208180359",
    status: "Approved", remarks: "All clear", file: "pledge_doc_004.pdf"
  },
  {
    id: "INV-005", requestDate: "2025-04-03", clientName: "Vikas Gupta", pan: "UVWXY7890Z",
    isin: "INE467B01029", scripName: "Bajaj Finance", quantity: 80, cmp: 6920.00,
    loanCode: "LC-9825", product: "LAP", utr: "UTR20250403005",
    pledgerDpId: "12081804", pledgerClientId: "1208180460",
    status: "Rejected", remarks: "Documents incomplete", file: "pledge_doc_005.pdf"
  },
  {
    id: "INV-006", requestDate: "2025-04-04", clientName: "Sunita Reddy", pan: "ABCFG2345H",
    isin: "INE062A01020", scripName: "SBI", quantity: 1000, cmp: 812.30,
    loanCode: "LC-9826", product: "SME", utr: "UTR20250404006",
    pledgerDpId: "12081805", pledgerClientId: "1208180561",
    status: "Pending Maker", remarks: "", file: "pledge_doc_006.pdf"
  },
  {
    id: "INV-007", requestDate: "2025-04-05", clientName: "Deepak Joshi", pan: "HIJKL6789M",
    isin: "INE009A01021", scripName: "Wipro", quantity: 400, cmp: 448.75,
    loanCode: "LC-9827", product: "CC", utr: "UTR20250405007",
    pledgerDpId: "12081806", pledgerClientId: "1208180662",
    status: "Pending Checker", remarks: "Verified by maker", file: "pledge_doc_007.pdf"
  },
  {
    id: "INV-008", requestDate: "2025-04-05", clientName: "Kavita Mehta", pan: "MNOPQ0123R",
    isin: "INE047A01021", scripName: "ICICI Bank", quantity: 600, cmp: 1105.60,
    loanCode: "LC-9828", product: "LAP", utr: "UTR20250405008",
    pledgerDpId: "12081807", pledgerClientId: "1208180763",
    status: "Pending Risk", remarks: "Checker approved", file: "pledge_doc_008.pdf"
  },
];

export const targetDPs = [
  { id: 1, entityName: "FinSmart NBFC Ltd", dpId: "IN300095", clientId: "IN30009511223344", bank: "HDFC Bank", ifsc: "HDFC0001234", accountNo: "50100123456789", status: "Active" },
  { id: 2, entityName: "FinSmart Capital", dpId: "IN301330", clientId: "IN30133011223345", bank: "ICICI Bank", ifsc: "ICIC0001234", accountNo: "123456789012", status: "Active" },
  { id: 3, entityName: "FinSmart Investments", dpId: "IN302269", clientId: "IN30226911223346", bank: "Axis Bank", ifsc: "UTIB0001234", accountNo: "910010012345678", status: "Pending" },
];

export const auditLog = [
  { id: 1, invocationId: "INV-001", action: "Submitted", user: "initiator@finsmart.com", timestamp: "2025-04-01 09:15:00", remarks: "Initial submission" },
  { id: 2, invocationId: "INV-002", action: "Maker Approved", user: "maker@finsmart.com", timestamp: "2025-04-02 11:30:00", remarks: "Documents verified" },
  { id: 3, invocationId: "INV-003", action: "Checker Approved", user: "checker@finsmart.com", timestamp: "2025-04-02 14:45:00", remarks: "All checks passed" },
  { id: 4, invocationId: "INV-004", action: "Risk Approved", user: "risk@finsmart.com", timestamp: "2025-04-03 16:20:00", remarks: "All clear" },
  { id: 5, invocationId: "INV-005", action: "Rejected", user: "risk@finsmart.com", timestamp: "2025-04-03 17:00:00", remarks: "Documents incomplete" },
];

export const stats = {
  total: 8, pendingMaker: 2, pendingChecker: 2, pendingRisk: 2, approved: 1, rejected: 1,
  totalValue: invocations.reduce((s, i) => s + i.quantity * i.cmp, 0),
};
