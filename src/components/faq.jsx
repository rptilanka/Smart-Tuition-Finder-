import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faq = [
  {
    question: "How do I find the right tutor?",
    answer:
      "Browse tutor profiles by subject, location, grade level, and teaching style. You can compare details before choosing who to contact.",
  },
  {
    question: "Are tutor profiles verified?",
    answer:
      "Tutor profiles are designed to show key details like qualifications, subjects, experience, and contact information so students can make informed decisions.",
  },
  {
    question: "Can I find tutors near my area?",
    answer:
      "Yes. Smart Tuition Finder supports location-based discovery so you can look for tutors in nearby cities and areas.",
  },
  {
    question: "How do students contact tutors?",
    answer:
      "Students can view tutor profiles and use the available contact options to start a conversation directly with a suitable tutor.",
  },
  {
    question: "Is there a fee to use the platform?",
    answer:
      "Students can explore the platform and browse tutor information. Any tuition fee is arranged directly based on the tutor and lesson plan.",
  },
  {
    question: "How long does registration take?",
    answer:
      "Student and tutor registration only takes a few minutes. After signing up, users can access their relevant dashboard and profile options.",
  },
  {
    question: "Can tutors edit their profile later?",
    answer:
      "Yes. Tutors can sign in to their dashboard and update profile details such as subjects, areas, experience, and contact information.",
  },
  {
    question: "Can students save or compare tutors?",
    answer:
      "Students can review tutor information and compare key details before deciding which tutor best fits their needs.",
  },
  {
    question: "What subjects are supported?",
    answer:
      "The platform supports common school and exam subjects such as Maths, Science, English, Physics, History, Art, and more.",
  },
  {
    question: "Who can join as a tutor?",
    answer:
      "Teachers, graduates, undergraduates, and experienced subject specialists can create tutor profiles to connect with students.",
  },
];

const FAQ = () => {
  const [value, setValue] = useState();

  return (
    <section
      id="faq"
      className="flex min-h-screen items-center justify-center px-6 py-12 scroll-mt-24"
    >
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Quick answers about finding tutors, registering, profiles, and using
          Smart Tuition Finder.
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
