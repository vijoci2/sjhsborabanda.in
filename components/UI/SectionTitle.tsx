type SectionTitleProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  title,
  description,
  align = "center"
}: SectionTitleProps) {
  return (
    <div
      className={`mx-auto mb-10 max-w-3xl ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <div className="mx-auto mb-4 h-1 w-14 rounded-full bg-gold" />
      <h2 className="text-balance text-3xl font-bold tracking-tight text-navy md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-7 text-slate-600 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
