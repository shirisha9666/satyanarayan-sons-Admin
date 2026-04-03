import React, { useState, useEffect } from "react";
import { isAutheticated } from "src/auth";
import { getUser } from "src/loginUserdetails";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";

const colors = {
  gradientHeader: "linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 80%, #f59e0b 100%)",
  gradientBtn: "linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)",
  pageBg: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
  cardBg: "#ffffff",
  sectionBorder: "1px solid #fde68a",
  inputBg: "#fffbf0",
  inputBorder: "1.5px solid #fcd88a",
  inputFocusBorder: "#d97706",
  inputFocusShadow: "0 0 0 3px rgba(217,119,6,0.15)",
  labelColor: "#92400e",
  textPrimary: "#1c1917",
  textMuted: "#78350f",
  amber100: "#fef3c7",
  amber200: "#fde68a",
  amber700: "#b45309",
  amber800: "#92400e",
};

const styles = {
  page: {
  minHeight: "100vh",
  width: "100%",
  background: colors.pageBg,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
  padding: "0",
},
  card: {
  background: colors.cardBg,
  width: "100%",
  minHeight: "100vh",
  borderRadius: "0", // remove rounded look
  boxShadow: "none", // remove floating effect
},
  heroHeader: {
    background: colors.gradientHeader,
    padding: "32px 40px 28px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.2)",
    border: "1.5px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  heroTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.01em",
  },
  heroSub: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
    fontWeight: 400,
  },
  formBody: {
  padding: "20px 40px",
  background: "#fffdf7",
},
  section: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #fde68a",
    marginBottom: "20px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(180,120,40,0.06)",
  },
  sectionHead: {
    background: "linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badge: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.22)",
    border: "1.5px solid rgba(255,255,255,0.5)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.01em",
  },
  sectionBody: {
    padding: "18px 20px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "14px",
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "14px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 700,
    color: colors.labelColor,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    padding: "10px 13px",
    border: colors.inputBorder,
    borderRadius: "10px",
    fontSize: "14px",
    color: colors.textPrimary,
    background: colors.inputBg,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "10px 13px",
    border: colors.inputBorder,
    borderRadius: "10px",
    fontSize: "14px",
    color: colors.textPrimary,
    background: colors.inputBg,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  checkCard: (checked) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 14px",
    border: `2px solid ${checked ? "#d97706" : "#fde68a"}`,
    borderRadius: "12px",
    background: checked ? "#fffbeb" : "#fffdf5",
    cursor: "pointer",
    transition: "all 0.18s",
  }),
  checkLabel: (checked) => ({
    fontSize: "13px",
    fontWeight: 600,
    color: checked ? "#92400e" : "#44403c",
    cursor: "pointer",
  }),
  checkDesc: {
    fontSize: "11px",
    color: "#a16207",
    marginTop: "2px",
  },
  radioCard: (selected) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    border: `2px solid ${selected ? "#d97706" : "#fde68a"}`,
    borderRadius: "10px",
    background: selected ? "#fffbeb" : "#fffdf5",
    cursor: "pointer",
    transition: "all 0.18s",
    fontSize: "13px",
    fontWeight: selected ? 600 : 400,
    color: selected ? "#92400e" : "#44403c",
  }),
  uploadZone: {
    border: "2px dashed #fcd88a",
    borderRadius: "12px",
    padding: "18px",
    textAlign: "center",
    background: "#fffbf0",
    cursor: "pointer",
    transition: "border-color 0.2s",
    marginTop: "14px",
  },
  submitBtn: (disabled) => ({
    width: "100%",
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    background: disabled
      ? "#d6d3d1"
      : colors.gradientBtn,
    color: disabled ? "#a8a29e" : "#fff",
    fontWeight: 700,
    fontSize: "16px",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    letterSpacing: "0.02em",
    boxShadow: disabled ? "none" : "0 4px 20px rgba(180,83,9,0.35)",
    transition: "opacity 0.2s, transform 0.1s",
    fontFamily: "inherit",
    marginTop: "4px",
  }),
};

// Focused input wrapper
function Input({ label, type = "text", placeholder, value, onChange, readOnly, style }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.fieldGroup}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={{
          ...styles.input,
          ...(focused ? { borderColor: colors.inputFocusBorder, boxShadow: colors.inputFocusShadow } : {}),
          ...(readOnly ? { background: "#f5f5f4", color: "#78350f", fontWeight: 600 } : {}),
          ...style,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.fieldGroup}>
      {label && <label style={styles.label}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          ...styles.textarea,
          ...(focused ? { borderColor: colors.inputFocusBorder, boxShadow: colors.inputFocusShadow } : {}),
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function  CustomSelect({ label, value, onChange, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.fieldGroup}>
      {label && <label style={styles.label}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        style={{
          ...styles.input,
          cursor: "pointer",
          ...(focused ? { borderColor: colors.inputFocusBorder, boxShadow: colors.inputFocusShadow } : {}),
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </select>
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHead}>
        <div style={styles.badge}>{num}</div>
        <span style={styles.sectionTitle}>{title}</span>
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  );
}

const extractUserFromResponse = (response) =>
  response?.data?.data ?? response?.data?.user ?? response?.data ?? null;

const extractBranchFromUser = (user) => {
  if (!user) return { id: "", name: "", code: "" };

  const branchFromBranchId =
    user?.branchId && typeof user.branchId === "object" ? user.branchId : null;
  const branchFromBranch =
    user?.branch && typeof user.branch === "object" ? user.branch : null;
  const branchObj = branchFromBranchId || branchFromBranch;

  const id =
    branchObj?._id ??
    branchObj?.id ??
    (typeof user?.branchId === "string" ? user.branchId : "");

  const name = branchObj?.branchName ?? branchObj?.name ?? user?.branchName ?? "";

  const code = branchObj?.branchCode ?? branchObj?.code ?? user?.branchCode ?? "";

  return {
    id: id ? String(id) : "",
    name: name ? String(name) : "",
    code: code ? String(code) : "",
  };
};

const GoldForm = () => {
  const [selectedId, setSelectedId] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const token = isAutheticated();

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [nomineeName, setNomineeName] = useState("");
  const [nomineePhone, setNomineePhone] = useState("");
  const [nomineeRelationship, setNomineeRelationship] = useState("");

  const [introducerName, setIntroducerName] = useState("");
  const [introducerPhone, setIntroducerPhone] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [idProofNumber, setIdProofNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [goldRateAvg, setGoldRateAvg] = useState(false);
  const [goldRatePurchase, setGoldRatePurchase] = useState(false);
  const [planBonus, setPlanBonus] = useState(false);
  const [planNoVA, setPlanNoVA] = useState(false);

  const [uploadFile, setUploadFile] = useState(null);
  const [membershipNo, setMembershipNo] = useState("");
  const [lastCreatedMembershipNo, setLastCreatedMembershipNo] = useState("");
  const [paymentType, setPaymentType] = useState("");
const [transactionId, setTransactionId] = useState("");

  const idOptions = ["Aadhar Card", "PAN Card", "Driving Licence", "Voter ID"];
  const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];};
const getCompletionDate = () => {
  const date = new Date();
  const plan = plans.find((p) => String(p?._id) === String(selectedPlanId));
  const months = plan?.Months ? Number(plan.Months) : 11;
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split("T")[0];
};
const [branch, setBranch] = useState({
  name: "",
  id: "",
  code: "",
});
const fetchMembershipId = async () => {
  try {
    const res = await axios.post(
      "/api/gold/scheme/get/membership/",
      {}, // 🔥 no need to send branch
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMembershipNo(res.data.result);
  } catch (err) {
    console.log("Membership error:", err);
  }
};
useEffect(() => {
  if (token) {
    fetchMembershipId();
  }
}, [token]);

useEffect(() => {
  let cancelled = false;

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/api/gold/schema/get/all");
      if (cancelled) return;
      setPlans(res?.data?.result || []);
    } catch (err) {
      console.log("Plans error:", err);
    }
  };

  fetchPlans();
  return () => {
    cancelled = true;
  };
}, []);
const [branchLoading, setBranchLoading] = useState(false);

useEffect(() => {
  let cancelled = false;

  const fetchLoginUserAndBranch = async () => {
    if (!token) {
      setBranch({ id: "", name: "", code: "" });
      return;
    }

    setBranchLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      let user = null;
      try {
        const resp = await axios.get("/api/v1/user/login/", { headers });
        user = extractUserFromResponse(resp);
      } catch (_) {
        const resp = await axios.get("/api/v1/user/details", { headers });
        user = extractUserFromResponse(resp);
      }

      if (cancelled) return;

      const fromApi = extractBranchFromUser(user);
      const fromToken = extractBranchFromUser(getUser());

      setBranch(fromApi?.name || fromApi?.id || fromApi?.code ? fromApi : fromToken);
    } catch (error) {
      if (cancelled) return;
      setBranch(extractBranchFromUser(getUser()));
    } finally {
      if (!cancelled) setBranchLoading(false);
    }
  };

  fetchLoginUserAndBranch();
  return () => {
    cancelled = true;
  };
}, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!selectedPlanId) {
      toast.error("Please select a scheme plan");
      return;
    }

    const cleanedName = String(fullName || "").trim();
    const cleanedMobile = String(mobile || "").replace(/[^\d]/g, "").trim();
    const cleanedEmail = String(email || "").trim();
    const cleanedAddress = String(address || "").trim();

    if (!cleanedName) {
      toast.error("Please enter customer name");
      return;
    }

    if (!cleanedMobile) {
      toast.error("Please enter mobile number");
      return;
    }

    if (!cleanedAddress) {
      toast.error("Please enter address");
      return;
    }

    if (!goldRateAvg && !goldRatePurchase) {
      toast.error("Please select gold rate option");
      return;
    }

    if (goldRateAvg && goldRatePurchase) {
      toast.error("Please select only one gold rate option");
      return;
    }

    const goldRateOption = goldRateAvg ? "AVG_RATE" : "TIME_OF_PURCHASE";

    if (!selectedId) {
      toast.error("Please select ID proof type");
      return;
    }

    if (!uploadFile) {
      toast.error("Please upload ID proof");
      return;
    }

    if (!paymentType) {
      toast.error("Please select payment type");
      return;
    }

    if (
      (paymentType === "upi" || paymentType === "online") &&
      !String(transactionId || "").trim()
    ) {
      toast.error("Transaction ID is required for UPI/Online payments");
      return;
    }

    if (!acceptTerms) {
      toast.error("Please accept terms & conditions");
      return;
    }

    const formData = new FormData();

    formData.append("name", cleanedName);
    if (cleanedEmail) formData.append("email", cleanedEmail);
    formData.append("mobile", cleanedMobile);
    formData.append("phoneNo", cleanedMobile);
    formData.append("address", cleanedAddress);

    if (String(nomineeName || "").trim()) {
      formData.append("nomineeName", String(nomineeName).trim());
    }
    if (String(nomineePhone || "").trim()) {
      formData.append("nomineePhone", String(nomineePhone).trim());
    }
    if (String(nomineeRelationship || "").trim()) {
      formData.append("nomineeRelationship", String(nomineeRelationship).trim());
    }

    if (String(introducerName || "").trim()) {
      formData.append("introducerName", String(introducerName).trim());
    }
    if (String(introducerPhone || "").trim()) {
      formData.append("introducerPhone", String(introducerPhone).trim());
    }

    if (String(bankName || "").trim()) {
      formData.append("bankName", String(bankName).trim());
    }
    if (String(accountHolderName || "").trim()) {
      formData.append("accountHolderName", String(accountHolderName).trim());
    }
    if (String(accountNo || "").trim()) {
      formData.append("accountNo", String(accountNo).trim());
    }
    if (String(ifscCode || "").trim()) {
      formData.append("ifscCode", String(ifscCode).trim());
    }

    if (String(idProofNumber || "").trim()) {
      formData.append("idProofNumber", String(idProofNumber).trim());
    }

    formData.append("goldRateOption", goldRateOption);
    formData.append("bonus", String(planBonus));
    formData.append("noVAupto10", String(planNoVA));
    if (String(membershipNo || "").trim()) {
      formData.append("membershipNo", String(membershipNo).trim());
    }
    formData.append("idProofType", selectedId);
    formData.append("idProofFile", uploadFile);
    formData.append("isTermsAccepted", "true");
    formData.append("paymentMethod", paymentType);
    if (String(transactionId || "").trim()) {
      formData.append("transactionId", String(transactionId).trim());
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `/api/gold/scheme/offline/create/${selectedPlanId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createdNo = res?.data?.scheme?.membershipNo || "";
      if (createdNo) {
        setLastCreatedMembershipNo(createdNo);
      }

      toast.success(
        createdNo
          ? `Scheme created (${createdNo})`
          : res?.data?.message || "Scheme created"
      );

      // reset form
      setFullName("");
      setMobile("");
      setEmail("");
      setAddress("");
      setNomineeName("");
      setNomineePhone("");
      setNomineeRelationship("");
      setIntroducerName("");
      setIntroducerPhone("");
      setBankName("");
      setAccountHolderName("");
      setAccountNo("");
      setIfscCode("");
      setIdProofNumber("");
      setSelectedId("");
      setUploadFile(null);
      setGoldRateAvg(false);
      setGoldRatePurchase(false);
      setPlanBonus(false);
      setPlanNoVA(false);
      setPaymentType("");
      setTransactionId("");
      setAcceptTerms(false);

      await fetchMembershipId();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create scheme");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HERO HEADER */}
        <div style={styles.heroHeader}>
          {/* decorative circles */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={styles.heroIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={styles.heroTitle}>P. Satyanarayan Sons Jewellers</h1>
          <p style={styles.heroSub}>Easy Gold Buying Plans — Application Form</p>
        </div>

        {/* FORM BODY */}
        <div style={styles.formBody}>
          <form onSubmit={handleSubmit}>

            {/* 1. MEMBERSHIP */}
            <Section num="1" title="Membership Details">
              <div style={{ ...styles.grid2, marginBottom: "14px" }}>
               <Input
      label="Date of Joining"
      type="date"
      value={getTodayDate()}
      readOnly
    />

    <Input
      label="Date of Completion"
      type="date"
      value={getCompletionDate()}
      readOnly
    />

              </div>
              <div style={styles.grid2}>
                <Input
  label="Branch"
  value={
    branchLoading
      ? "Loading..."
      : `${branch?.name || branch?.id || ""}${
          branch?.code ? ` (${branch.code})` : ""
        }`
  }
  placeholder="Branch"
  readOnly
/>
                <Input
  label="Membership No."
  value={membershipNo}
  readOnly
/>
              </div>

              <div style={{ marginTop: "14px" }}>
                <CustomSelect
                  label="Scheme Plan"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                >
                  <option value="">Select Scheme Plan</option>
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.Scheme_Name} | ₹{p.Monthly_Installment} | {p.Months} Months
                    </option>
                  ))}
                </CustomSelect>
              </div>

              {lastCreatedMembershipNo && (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#92400e",
                    fontWeight: 600,
                  }}
                >
                  Last created Membership No: {lastCreatedMembershipNo}
                </div>
              )}
            </Section>

            {/* 2. PERSONAL INFO */}
            <Section num="2" title="Personal Information">
              <div style={{ marginBottom: "14px" }}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div style={{ ...styles.grid2, marginBottom: "14px" }}>
               
                <Input
                  label="Mobile"
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                 <Input
                  label="Email Address"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Textarea
                label="Address"
                placeholder="Full residential address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              
              {/* <Textarea label="Address" placeholder="Full residential address" /> */}
            </Section>

            {/* 3. NOMINEE */}
            <Section num="3" title="Nominee Details">
              <div style={styles.grid3}>
                <Input
                  label="Nominee Name"
                  placeholder="Full name"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                />
                <Input
                  label="Nominee Phone"
                  placeholder="Phone number"
                  value={nomineePhone}
                  onChange={(e) => setNomineePhone(e.target.value)}
                />
                <CustomSelect
                  label="Relationship"
                  value={nomineeRelationship}
                  onChange={(e) => setNomineeRelationship(e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Spouse</option>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Son</option>
                  <option>Daughter</option>
                  <option>Sibling</option>
                  <option>Other</option>
                </CustomSelect>
              </div>
            </Section>

            {/* 4. PLAN OPTIONS */}
            <Section num="4" title="Gold Rate & Plan Options">
              <div style={{ marginBottom: "10px" }}>
                <label style={{ ...styles.label, marginBottom: "8px", display: "block" }}>Gold Rate Option</label>
                <div style={styles.grid2}>
                  <label style={styles.checkCard(goldRateAvg)}>
                    <input
                      type="radio"
                      name="goldRateOption"
                      checked={goldRateAvg}
                      onChange={() => {
                        setGoldRateAvg(true);
                        setGoldRatePurchase(false);
                      }}
                      style={{ accentColor: "#d97706", width: "15px", height: "15px", marginTop: "2px", flexShrink: 0, cursor: "pointer" }}
                    />
                    <div>
                      <p style={{ margin: 0, ...styles.checkLabel(goldRateAvg) }}>
                        Average Rate
                      </p>
                      <p style={{ margin: 0, ...styles.checkDesc }}>
                        Based on monthly average
                      </p>
                    </div>
                  </label>

                  <label style={styles.checkCard(goldRatePurchase)}>
                    <input
                      type="radio"
                      name="goldRateOption"
                      checked={goldRatePurchase}
                      onChange={() => {
                        setGoldRatePurchase(true);
                        setGoldRateAvg(false);
                      }}
                      style={{ accentColor: "#d97706", width: "15px", height: "15px", marginTop: "2px", flexShrink: 0, cursor: "pointer" }}
                    />
                    <div>
                      <p
                        style={{ margin: 0, ...styles.checkLabel(goldRatePurchase) }}
                      >
                        Rate at Purchase
                      </p>
                      <p style={{ margin: 0, ...styles.checkDesc }}>
                        Live rate on purchase date
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label style={{ ...styles.label, marginBottom: "8px", display: "block" }}>Plan Benefits</label>
                <div style={styles.grid2}>
                  {[
                    { state: planBonus, set: setPlanBonus, label: "Bonus Included", desc: "Eligible for scheme bonus" },
                    { state: planNoVA, set: setPlanNoVA, label: "No V.A. up to 10%", desc: "Value addition waived" },
                  ].map(({ state, set, label, desc }) => (
                    <label key={label} style={styles.checkCard(state)}>
                      <input
                        type="checkbox"
                        checked={state}
                        onChange={(e) => set(e.target.checked)}
                        style={{ accentColor: "#d97706", width: "15px", height: "15px", marginTop: "2px", flexShrink: 0, cursor: "pointer" }}
                      />
                      <div>
                        <p style={{ margin: 0, ...styles.checkLabel(state) }}>{label}</p>
                        <p style={{ margin: 0, ...styles.checkDesc }}>{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Section>

            {/* 5. ID PROOF */}
            <Section num="5" title="ID Proof Details">
              <label style={{ ...styles.label, marginBottom: "10px", display: "block" }}>Select ID Type</label>
              <div style={styles.grid4}>
                {idOptions.map((id) => (
                  <label key={id} style={styles.radioCard(selectedId === id)}>
                    <input
                      type="radio"
                      name="idProof"
                      value={id}
                      checked={selectedId === id}
                      onChange={() => setSelectedId(id)}
                      style={{ accentColor: "#d97706", cursor: "pointer" }}
                    />
                    {id}
                  </label>
                ))}
              </div>

              <div style={{ marginTop: "14px" }}>
                <Input
                  label="ID Proof Number (optional)"
                  placeholder="Enter ID proof number"
                  value={idProofNumber}
                  onChange={(e) => setIdProofNumber(e.target.value)}
                />
              </div>

              {selectedId && (
                <div
                  style={styles.uploadZone}
                  onClick={() => document.getElementById("idFileUpload").click()}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px", display: "block" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p style={{ margin: 0, fontSize: "13px", color: "#92400e", fontWeight: 600 }}>
                    {uploadFile ? uploadFile.name : `Click to upload ${selectedId}`}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#b45309" }}>
                    JPG, PNG or PDF — max 5MB
                  </p>
                  <input
                    id="idFileUpload"
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => setUploadFile(e.target.files[0] || null)}
                  />
                </div>
              )}
            </Section>

            {/* 6. BANK DETAILS */}
            <Section num="6" title="Bank Details">
              <div style={{ ...styles.grid2, marginBottom: "14px" }}>
                <Input
                  label="Bank Name"
                  placeholder="e.g. State Bank of India"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                <Input label="Branch" placeholder="Branch name" />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <Input
                  label="Account Holder Name"
                  placeholder="Name as per bank records"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                />
              </div>
              <div style={styles.grid2}>
                <Input
                  label="Account Number"
                  placeholder="Account number"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                />
                <Input
                  label="IFSC Code"
                  placeholder="e.g. SBIN0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>
            </Section>
            <Section num="7" title="Payment Details">
  <div style={styles.grid2}>

    {/* PAYMENT TYPE */}
    <FormControl fullWidth>
      <InputLabel>Payment Type</InputLabel>
      <Select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
      >
        <MenuItem value="">Select Payment Type</MenuItem>
        <MenuItem value="cash">Cash</MenuItem>
        <MenuItem value="upi">UPI</MenuItem>
        <MenuItem value="online">Online</MenuItem>
      </Select>
    </FormControl>

    {/* TRANSACTION ID (ONLY FOR UPI / ONLINE) */}
    {(paymentType === "upi" || paymentType === "online") && (
      <Input
        label="Transaction ID"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        placeholder="Enter Transaction ID"
      />
    )}

  </div>
</Section>
            {/* TERMS + SUBMIT */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #fde68a",
                padding: "18px 20px",
                boxShadow: "0 2px 10px rgba(180,120,40,0.06)",
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", marginBottom: "18px" }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ accentColor: "#d97706", width: "16px", height: "16px", marginTop: "3px", flexShrink: 0, cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "#57534e", lineHeight: 1.6 }}>
                  I declare that all information provided is true and correct. I agree to the{" "}
                  <span style={{ color: "#d97706", fontWeight: 600, textDecoration: "underline" }}>
                    Terms & Conditions
                  </span>{" "}
                  of P. Satyanarayan Sons Jewellers Gold Buying Plan.
                </span>
              </label>

              <button
                type="submit"
                disabled={!acceptTerms || submitting}
                style={styles.submitBtn(!acceptTerms || submitting)}
                onMouseEnter={(e) => {
                  if (acceptTerms && !submitting)
                    e.currentTarget.style.transform = "scale(1.01)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(45%) sepia(80%) saturate(400%) hue-rotate(10deg);
        }
        select option { background: #fff; color: #1c1917; }
      `}</style>
    </div>
  );
};

export default GoldForm;
