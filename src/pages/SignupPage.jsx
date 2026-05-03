import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AuthLayout from "../components/auth/AuthLayout";
import StudentRegisterPage from "./StudentRegisterPage";
import TutorRegisterPage from "./TutorRegisterPage";

const signupAside = (
  <>
    <h3 className="max-w-sm text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground">
      Students and tutors start here.
    </h3>
    <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
      Create a free account in one place. Switch between student and tutor
      registration anytime before you submit.
    </p>
    <ul className="mt-7 space-y-2.5 text-sm font-medium text-foreground/90">
      {[
        "Role-specific dashboards after sign-in",
        "Secure email and password sign-up",
        "Built for learners and educators in Sri Lanka"
      ].map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center bg-background/95 text-foreground shadow-sm backdrop-blur-sm">
            <CheckCircle2 size={13} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  </>
);

export default function SignupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = searchParams.get("role") === "tutor" ? "tutor" : "student";

  return (
    <AuthLayout
      fullPage
      aside={signupAside}
      title="Create an account"
      subtitle="Choose student or tutor, then complete the form below."
    >

      <Tabs
        value={role}
        onValueChange={(value) => {
          setSearchParams(value === "tutor" ? { role: "tutor" } : {}, {
            replace: true
          });
        }}
        className="flex flex-col"
      >
        <TabsList className="grid h-11 w-full grid-cols-2 rounded-none bg-slate-200/90 p-1 dark:bg-slate-800/90">
          <TabsTrigger
            value="student"
            className="rounded-none text-sm font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm after:hidden dark:text-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-white"
          >
            Student
          </TabsTrigger>
          <TabsTrigger
            value="tutor"
            className="rounded-none text-sm font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm after:hidden dark:text-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-white"
          >
            Tutor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-8 outline-none">
          <StudentRegisterPage embedded />
        </TabsContent>
        <TabsContent value="tutor" className="mt-8 outline-none">
          <TutorRegisterPage embedded />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
