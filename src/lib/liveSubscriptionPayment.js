import {
  buildPayHereHash,
  ensurePayHereScript,
  getPayHereConfig,
  validatePayHereConfig,
} from "./payhere";

function getStudentSubscriptionPriceLkr() {
  const raw = import.meta.env.VITE_STUDENT_TUTOR_SUBSCRIPTION_PRICE_LKR;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 1500;
}

export async function startStudentTutorSubscriptionCheckout({
  studentId,
  studentName,
  studentEmail,
  tutorId,
  tutorName,
  onCompleted,
  onDismissed,
  onError,
}) {
  const payhere = await ensurePayHereScript();
  const cfg = getPayHereConfig();
  const configError = validatePayHereConfig(cfg);
  if (configError) throw new Error(configError);

  payhere.onCompleted = () => onCompleted?.();
  payhere.onDismissed = () => onDismissed?.();
  payhere.onError = (error) => onError?.(error);

  const amount = getStudentSubscriptionPriceLkr();
  const orderId = `STUSUB-${tutorId}-${studentId}-${Date.now()}`;
  const hash = buildPayHereHash({
    merchantId: cfg.merchantId,
    orderId,
    amount,
    currency: "LKR",
    merchantSecret: cfg.merchantSecret,
  });

  const splitName = String(studentName || "Student").trim().split(/\s+/);
  const firstName = splitName[0] || "Student";
  const lastName = splitName.slice(1).join(" ") || "Member";

  payhere.startPayment({
    sandbox: true,
    merchant_id: cfg.merchantId,
    hash,
    return_url: cfg.returnUrl,
    cancel_url: cfg.cancelUrl,
    notify_url: cfg.notifyUrl,
    order_id: orderId,
    items: `Live class subscription - ${tutorName || "Tutor"}`,
    amount: amount.toFixed(2),
    currency: "LKR",
    first_name: firstName,
    last_name: lastName,
    email: studentEmail || "student@example.com",
    phone: "0771234567",
    address: cfg.address,
    city: cfg.city,
    country: cfg.country,
    custom_1: studentId,
    custom_2: tutorId,
  });
}
