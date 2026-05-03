import { SlidersHorizontal } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type TutorFilterOption = { id: string; label: string };

export type TutorDirectoryFiltersSharedProps = {
  subject: string;
  setSubject: (id: string) => void;
  subjectOptions: TutorFilterOption[];
  price: string;
  setPrice: (id: string) => void;
  priceOptions: TutorFilterOption[];
  rating: string;
  setRating: (id: string) => void;
  ratingOptions: TutorFilterOption[];
  sortBy: string;
  setSortBy: (id: string) => void;
  sortOptions: TutorFilterOption[];
  activeFilterCount: number;
  onResetFilters: () => void;
};

export type TutorDirectoryFilterToolbarProps = {
  activeFilterCount: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

function FilterToggleGroup({
  options,
  value,
  onChange,
}: {
  options: TutorFilterOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
      variant="outline"
      size="sm"
      className="flex w-full max-w-full flex-wrap justify-start gap-2"
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt.id}
          value={opt.id}
          className={cn(
            "h-auto min-h-8 shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-tight data-[state=on]:border-slate-950 data-[state=on]:bg-slate-950 data-[state=on]:text-white data-[state=on]:shadow-sm dark:data-[state=on]:border-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-slate-950",
          )}
        >
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function TutorDirectoryFilterToolbar({
  activeFilterCount,
  sidebarOpen,
  onToggleSidebar,
}: TutorDirectoryFilterToolbarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        onClick={onToggleSidebar}
        aria-expanded={sidebarOpen}
        aria-controls="tutor-directory-filters"
        className="relative shrink-0 gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        <SlidersHorizontal className="size-3.5" />
        Filters
        {activeFilterCount > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-700 px-1 text-[10px] font-bold text-white dark:bg-slate-300 dark:text-slate-950">
            {activeFilterCount}
          </span>
        ) : null}
      </Button>
    </div>
  );
}

export function TutorDirectoryFiltersSidebar(
  props: TutorDirectoryFiltersSharedProps,
) {
  const {
    subject,
    setSubject,
    subjectOptions,
    price,
    setPrice,
    priceOptions,
    rating,
    setRating,
    ratingOptions,
    sortBy,
    setSortBy,
    sortOptions,
    activeFilterCount,
    onResetFilters,
  } = props;

  return (
    <Card
      id="tutor-directory-filters"
      size="sm"
      className="gap-0 py-0 shadow-sm"
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border px-5 pb-3 pt-4 sm:px-6">
        <CardTitle className="text-base font-semibold tracking-tight">
          Filters
        </CardTitle>
        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 rounded-full text-xs font-semibold"
            onClick={onResetFilters}
          >
            Clear all
          </Button>
        ) : null}
      </CardHeader>

      <ScrollArea className="min-h-0 max-h-[min(70dvh,28rem)] lg:max-h-[min(calc(100dvh-11rem),40rem)]">
        <CardContent className="space-y-5 px-5 pb-5 pt-4 sm:px-6">
          <Field orientation="vertical">
            <FieldLabel
              htmlFor="tutor-directory-sort"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Sort by
            </FieldLabel>
            <FieldContent>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  id="tutor-directory-sort"
                  size="default"
                  className="h-10 w-full rounded-lg border-input bg-background font-medium shadow-none hover:bg-muted/30"
                >
                  <SelectValue placeholder="Choose sort order" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={6}
                  className="z-[110] max-h-72 w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
                >
                  {sortOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Separator />

          <Accordion
            type="multiple"
            defaultValue={["subject", "price", "rating"]}
            className="w-full"
          >
            <AccordionItem value="subject" className="border-border">
              <AccordionTrigger className="py-2.5 text-sm font-medium hover:bg-muted/40 hover:no-underline">
                Subject
              </AccordionTrigger>
              <AccordionContent>
                <FilterToggleGroup
                  options={subjectOptions}
                  value={subject}
                  onChange={setSubject}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price" className="border-border">
              <AccordionTrigger className="py-2.5 text-sm font-medium hover:bg-muted/40 hover:no-underline">
                Price
              </AccordionTrigger>
              <AccordionContent>
                <FilterToggleGroup
                  options={priceOptions}
                  value={price}
                  onChange={setPrice}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rating" className="border-border">
              <AccordionTrigger className="py-2.5 text-sm font-medium hover:bg-muted/40 hover:no-underline">
                Rating
              </AccordionTrigger>
              <AccordionContent>
                <FilterToggleGroup
                  options={ratingOptions}
                  value={rating}
                  onChange={setRating}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
