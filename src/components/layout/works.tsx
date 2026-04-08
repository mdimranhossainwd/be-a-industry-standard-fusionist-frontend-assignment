const steps = [
  {
    number: "01",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F6E56"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Submit Your Idea",
    description:
      "Share any eco-friendly solution — big or small. Fill out a simple form and publish your idea to the community.",
  },
  {
    number: "02",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F6E56"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community Votes",
    description:
      "Members upvote, comment, and collaborate on ideas they believe in. The best ideas rise to the top naturally.",
  },
  {
    number: "03",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F6E56"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    title: "Get Approved",
    description:
      "Top-voted ideas get featured and reviewed. Approved projects get the spotlight and a chance to create real change.",
  },
];

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-bgSecondary rounded-2xl p-6 md:p-8 flex items-start gap-4 text-left border border-border hover:border-border hover:shadow-sm transition-all duration-300">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 md:w-11 md:h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start text-left flex-1">
        {/* Number */}
        <p className="text-4xl md:text-5xl font-bold text-textPrimary/10 leading-none mb-2 w-full text-left">
          {number}
        </p>

        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-textPrimary mb-2 w-full text-left">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-textSecondary leading-relaxed w-full text-left">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-16 px-5 max-w-6xl mx-auto text-center">
      <p className="text-xs font-medium tracking-widest uppercase text-textSecondary mb-2">
        Simple Process
      </p>
      <h1
        className="text-center font-serif font-semibold tracking-tight text-textPrimary
md:text-[50px] text-[40px] leading-[1.05] mb-6"
      >
        How It{" "}
        <span
          className="italic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
  bg-clip-text text-transparent"
        >
          Works
        </span>{" "}
      </h1>
      <p className="text-base text-textSecondary mb-12">
        Three simple steps to turn your eco idea into real impact.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}
