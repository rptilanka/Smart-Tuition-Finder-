import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useLanguage } from "../context/LanguageContext";

const FAQ = () => {
  const [value, setValue] = useState();
  const { t } = useLanguage();

  const faq = [
    { question: t.howFindRightTutor, answer: t.howFindRightTutorAns },
    { question: t.areTutorProfilesVerified, answer: t.areTutorProfilesVerifiedAns },
    { question: t.howStudentsContactTutors, answer: t.howStudentsContactTutorsAns },
    { question: t.isThereFee, answer: t.isThereFeAns },
    { question: t.howLongRegistration, answer: t.howLongRegistrationAns },
    { question: t.canTutorsEditProfile, answer: t.canTutorsEditProfileAns },
    { question: t.canStudentsSaveTutors, answer: t.canStudentsSaveTutorsAns },
    { question: t.whatSubjectsSupported, answer: t.whatSubjectsSupportedAns },
    { question: t.whoCanJoinAsTutor, answer: t.whoCanJoinAsTutorAns },
  ];

  return (
    <section
      id="faq"
      className="flex min-h-screen items-center justify-center px-6 py-12 scroll-mt-24"
    >
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
          {t.frequentlyAskedQuestions}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          {t.faqSubtitle}
        </p>

        <div className="mt-6 grid w-full gap-x-10 md:grid-cols-2">
          <Accordion
            className="w-full"
            collapsible
            onValueChange={setValue}
            type="single"
            value={value}
          >
            {faq.slice(0, 5).map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`question-${index}`}>
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                      "text-start text-lg",
                    )}
                  >
                    {question}
                    <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-base leading-7 text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion
            className="w-full"
            collapsible
            onValueChange={setValue}
            type="single"
            value={value}
          >
            {faq.slice(5).map(({ question, answer }, index) => (
              <AccordionItem key={question} value={`question-${index + 5}`}>
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex flex-1 items-center justify-between py-4 font-medium tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                      "text-start text-lg",
                    )}
                  >
                    {question}
                    <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-base leading-7 text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
