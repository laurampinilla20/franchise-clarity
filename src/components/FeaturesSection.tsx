export default function FeaturesSection() {
  const features = [
    {
      icon: "https://www.figma.com/api/mcp/asset/3f717d2c-7dc0-46b2-8e21-6db96f4c089e",
      title: "Smart decision",
      description: "Invest backed by data. We'll show you exactly which franchises thrive, and which to avoid.",
    },
    {
      icon: "https://www.figma.com/api/mcp/asset/8cc11dd5-4e01-4e7f-9fe8-fb3095711d6e",
      title: "Expert guidance",
      description: "Get 1-on-1 support from a trusted franchise advisor who treats your investment like their own.",
    },
    {
      icon: "https://www.figma.com/api/mcp/asset/081a7dfc-5dde-4a52-92ad-56dbfa76078b",
      title: "Complete panorama",
      description: "Explore the full franchise market. Spot real opportunities and make truly unbiased decisions.",
    },
  ];

  return (
    <section className="bg-[#163552] rounded-[32px] px-3 md:px-4 lg:px-8 py-10 md:py-12 mt-0">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-[32px] items-center justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 items-center px-8 md:px-[32px] py-[10px] text-center w-full md:w-[363px]"
            >
              <div className="flex items-center justify-center shrink-0 w-[62px] h-[62px]">
                <div className="bg-[#a4c6e8] flex items-center justify-center p-[6.986px] rounded-[10px] w-[62px] h-[62px]">
                  <div
                    className="flex-none"
                    style={index === 2 ? { transform: "rotate(180deg) scaleY(-1)" } : undefined}
                  >
                    <img
                      src={feature.icon}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 items-center text-white w-full">
                <h3 className="font-bold text-2xl leading-8">
                  {feature.title}
                </h3>
                <p className="font-normal text-base leading-6">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

