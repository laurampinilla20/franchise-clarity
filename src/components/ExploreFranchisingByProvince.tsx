import React, { useMemo, useState } from "react";
import "./ExploreFranchisingByProvince.css";

interface Province {
  name: string;
  imgUrl: string;
  imgAlt: string;
  description: string;
}

export default function ExploreFranchisingByProvince() {
  /**
   * NOTE:
   * In HubSpot this came from HubDB. For now we use mock data that matches:
   * { name, imgUrl, imgAlt, description }
   *
   * The "default row" in the original HubL is where row.name == "189865023242".
   */
  const rows = useMemo<Province[]>(
    () => [
      // Default row (special) — must NOT appear in the list (temporary default)
      {
        name: "189865023242",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20canada%20map.png",
        imgAlt: "Explore franchise opportunities",
        description: "Main",
      },
      {
        name: "Alberta",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20alberta%20canada.png",
        imgAlt: "Best franchises in Alberta",
        description:
          "Alberta offers a strong mix of low tax rates and business-friendly policies, making it attractive for franchise investors. Major cities like Calgary and Edmonton provide high-density markets, while smaller communities offer high-potential, underserved territories for expansion.",
      },
      {
        name: "British Columbia",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20British%20Columbia.png",
        imgAlt: "Best franchises in British Columbia",
        description:
          "One of Canada's most dynamic economies, BC sees high demand in sectors like food, health, and home services. With a growing population and strong consumer spending, cities like Vancouver and Victoria offer attractive growth opportunities for franchise investment.",
      },
      {
        name: "Manitoba",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Manitoba.png",
        imgAlt: "Best franchises in Manitoba",
        description:
          "A centrally located and affordable province, Manitoba provides stable economic conditions and access to major trade routes. Winnipeg serves as a key urban hub, while secondary markets allow franchises to expand with lower competition and strong local market presence. Growth potential remains high across regions.",
      },
      {
        name: "New Brunswick",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20New%20Brunswick.png",
        imgAlt: "Best franchises in New Brunswick",
        description:
          "New Brunswick offers bilingual markets, tight-knit communities, and emerging opportunities for franchises that deliver consistent service and strong customer value. The province's moderate cost of living and growing focus on local development make it an appealing region for strategic franchise expansion.",
      },
      {
        name: "Newfoundland and Labrador",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Newfoundland%20and%20Labrador.png",
        imgAlt: "Best franchises in Newfoundland and Labrador",
        description:
          "Newfoundland and Labrador's economy is shaped by regional industries and distinct consumer needs. Franchises that fit local demand—especially in essential services and food—can perform well in key markets like St. John's, while smaller areas may offer less competition and loyal customer bases.",
      },
      {
        name: "Nova Scotia",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Nova%20Scotia.png",
        imgAlt: "Best franchises in Nova Scotia",
        description:
          "Nova Scotia features strong regional centers like Halifax and growing demand across service-based industries. The province's tourism, population growth, and evolving local economy create opportunities for franchises that offer convenience, quality, and consistent customer experience in both urban and coastal areas.",
      },
      {
        name: "Ontario",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Ontario.png",
        imgAlt: "Best franchises in Ontario",
        description:
          "Ontario is Canada's largest provincial economy and offers diverse franchise opportunities across retail, food, healthcare, and business services. Major urban markets like Toronto, Ottawa, and Hamilton provide high demand and strong population density, while many mid-size cities offer expansion potential with lower competition.",
      },
      {
        name: "Prince Edward Island (PEI)",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Prince%20Edward%20Island%20(PEI).png",
        imgAlt: "Best franchises in Prince Edward Island (PEI)",
        description:
          "Small in population, PEI offers a loyal customer base and strong seasonal tourism. Franchises that align with food, hospitality, and essential services can thrive with the right location strategy. The province values personal relationships and consistent quality above all.",
      },
      {
        name: "Quebec",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Quebec.png",
        imgAlt: "Best franchises in Quebec",
        description:
          "Quebec is a bilingual, culturally distinct province with a large consumer market and major cities like Montreal and Quebec City. Franchises that adapt to local language expectations and consumer behavior can see strong performance. Quebec also offers solid demand in food, retail, and service sectors, but brands must tailor marketing and operations to this unique consumer base.",
      },
      {
        name: "Saskatchewan",
        imgUrl: "https://mvp.franchisegrade.com/hubfs/Best%20franchises%20in%20Saskatchewan.png",
        imgAlt: "Best franchises in Saskatchewan",
        description:
          "Saskatchewan is an emerging province for franchise expansion, supported by steady population growth and strong regional economies. Cities like Saskatoon and Regina offer scalable markets, while many rural areas present untapped potential for service and retail franchises. The province's lower operating costs and stable business environment create a strong foundation for investors seeking strong returns and long-term stability.",
      },
      {
        name: "Northern Territories",
        imgUrl:
          "https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Best%20franchises%20in%20Northern%20Territories.png",
        imgAlt: "Best franchises in Northern Territories",
        description:
          "Yukon, Northwest Territories, and Nunavut offer unique franchise opportunities in remote and specialized markets. While population density is lower, demand for essential goods and services is high in key hubs. Franchises that succeed here typically require strong operational planning, adaptability, and a deep understanding of local needs and logistics.",
      },
    ],
    []
  );

  const DEFAULT_FALLBACK_IMG = "/_hcms/image/default.jpg";
  const DEFAULT_FALLBACK_ALT = "Explore franchise opportunities";

  const defaultRow = useMemo(
    () => rows.find((r) => r.name === "189865023242") || null,
    [rows]
  );

  const defaultImageUrl =
    defaultRow?.imgUrl && defaultRow.imgUrl.trim().length > 0
      ? defaultRow.imgUrl
      : DEFAULT_FALLBACK_IMG;

  const defaultImageAlt =
    defaultRow?.imgAlt && defaultRow.imgAlt.trim().length > 0
      ? defaultRow.imgAlt
      : DEFAULT_FALLBACK_ALT;

  const provinces = useMemo(
    () => rows.filter((r) => r.name !== "189865023242"),
    [rows]
  );

  // selectedProvince === null => show list; otherwise show detail
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

  const showList = selectedProvince === null;
  const showDetail = selectedProvince !== null;

  const currentImageSrc = selectedProvince?.imgUrl || defaultImageUrl;
  const currentImageAlt =
    selectedProvince?.imgAlt || defaultImageAlt || DEFAULT_FALLBACK_ALT;

  return (
    <div className="accordion-module">
      <h2 className="titlemain">Explore Franchising by Province</h2>

      <div className="accordion-grid">
        {/* Image (column 1) */}
        <div className="accordion-image-wrapper">
          <img
            id="accordion-image"
            src={currentImageSrc}
            alt={currentImageAlt}
          />
        </div>

        {/* List (column 2) */}
        <div
          id="accordion-list"
          className={`province-grid ${showList ? "" : "hidden"}`}
        >
          {provinces.map((province) => (
            <button
              key={province.name}
              type="button"
              className="province-link"
              data-name={province.name}
              data-img={province.imgUrl}
              data-description={province.description}
              onClick={() => setSelectedProvince(province)}
            >
              <span className="province-name">{province.name}</span>
              <img
                className="province-icon location-icon"
                src="https://mvp.franchisegrade.com/hubfs/New%20style/Location%20dynamic%20pages/Arrow.png"
                alt="icon"
              />
            </button>
          ))}
        </div>

        {/* Detail (same grid cell as list) */}
        <div
          id="accordion-detail"
          className={`accordion-detail ${showDetail ? "" : "hidden"}`}
        >
          <h3 id="detail-title" className="province-name">
            {selectedProvince?.name || ""}
          </h3>

          <div className="province-description-box">
            <p id="detail-description">{selectedProvince?.description || ""}</p>
          </div>

          <button
            id="back-button"
            className="back-button"
            type="button"
            onClick={() => setSelectedProvince(null)}
          >
            <img
              className="back-button-img"
              src="https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/Arrow%20back.png"
              alt="icon"
            />
            See all the provinces
          </button>
        </div>
      </div>
    </div>
  );
}

