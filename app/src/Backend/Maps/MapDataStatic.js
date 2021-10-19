/*
   Static maps data (not updated each day)

   Includes data sources, kinds and values lists and metadata
*/
const MapStaticHost =
  process.env.REACT_APP_MAP_STATIC_HOST ??
  "https://emibcn.github.io/covid-data/Maps";

const days = `${MapStaticHost}/days.json`;

const MapaComarques = `${MapStaticHost}/Comarca.svg`;
const MapaMunicipis = `${MapStaticHost}/Municipi.svg`;

const comarcaEdat = `${MapStaticHost}/MapData-Comarca-edat.json`;
const comarcaPcrpos = `${MapStaticHost}/MapData-Comarca-pcrpos.json`;
const comarcaRisc = `${MapStaticHost}/MapData-Comarca-risc.json`;
const comarcaRt = `${MapStaticHost}/MapData-Comarca-rt.json`;
const comarcaTaxa_conf = `${MapStaticHost}/MapData-Comarca-taxa_conf.json`;
const comarcaTaxapcr = `${MapStaticHost}/MapData-Comarca-taxapcr.json`;

const municipiEdat = `${MapStaticHost}/MapData-Municipi-edat.json`;
const municipiPcrpos = `${MapStaticHost}/MapData-Municipi-pcrpos.json`;
const municipiRisc = `${MapStaticHost}/MapData-Municipi-risc.json`;
const municipiRt = `${MapStaticHost}/MapData-Municipi-rt.json`;
const municipiTaxa_conf = `${MapStaticHost}/MapData-Municipi-taxa_conf.json`;
const municipiTaxapcr = `${MapStaticHost}/MapData-Municipi-taxapcr.json`;

const MapDataStatic = {
  days,
  metadata: {
    risc: {
      title: "Risc de rebrot (iEPG) a població general",
      label: "Risc de rebrot (iEPG)",
      name: "Risc de rebrot (iEPG)",
      colors: [
        { color: "#88f", name: "Risc màxim - 6", value: 1500 },
        { color: "#00f", name: "Risc màxim - 5", value: 1200 },
        { color: "#00c", name: "Risc màxim - 4", value: 900 },
        { color: "#008", name: "Risc màxim - 3", value: 600 },
        { color: "#004", name: "Risc màxim - 2", value: 400 },
        { color: "#400", name: "Risc màxim", value: 210 },
        { color: "#800", name: "Risc extrem", value: 190 },
        { color: "#c00", name: "Risc altíssim", value: 160 },
        { color: "#f00", name: "Risc molt alt", value: 130 },
        { color: "#f40", name: "Risc alt", value: 100 },
        { color: "#f80", name: "Risc mitjà-alt", value: 70 },
        { color: "#fc0", name: "Risc mitjà", value: 50 },
        { color: "#ff0", name: "Risc mitjà-baix", value: 30 },
        { color: "#cf0", name: "Risc baix", value: 15 },
        { color: "#8f4", name: "Risc molt baix", value: 5 },
        { color: "#4f8", name: "Risc no nul", value: 1 },
        { color: "#0fc", name: "Risc mínim", value: 0 },
      ],
    },
    taxa_conf: {
      title: "Taxa setmanal de casos confirmats PCR a tota la població",
      label: "Taxa confirmats per PCR",
      name: "Taxa setmanal de casos confirmats PCR",
      colors: [
        { color: "#a00", name: ">=300", value: 300 },
        { color: "#d00", name: ">=200 i <300", value: 200 },
        { color: "#f00", name: ">=100 i <200", value: 100 },
        { color: "#f80", name: ">=75 i <100", value: 75 },
        { color: "#fa0", name: ">=50 i <75", value: 50 },
        { color: "#fc0", name: ">=25 i <50", value: 25 },
        { color: "#0b0", name: ">=15 i <25", value: 15 },
        { color: "#090", name: "<15", value: 0 },
      ],
    },
    rt: {
      title: "Velocitat de propagació (Rt) a població general",
      label: "Rt",
      name: "Velocitat de propagació (Rt)",
      colors: [
        { color: "#f00", name: ">=2", value: 2 },
        { color: "#f70", name: ">=1.5 i <2", value: 1.5 },
        { color: "#fa0", name: ">=1.2 i <1.5", value: 1.2 },
        { color: "#fc0", name: ">1 i <1.2", value: 1.00001 },
        { color: "#0a0", name: "<=1", value: 0 },
      ],
    },
    edat: {
      title: "Mitjana d'edat dels casos confirmats per PCR a tota la població",
      label: "Mitjana edat",
      name: "Mitjana d'edat dels casos confirmats per PCR",
      colors: [
        { color: "#08519c", name: ">=60", value: 60 },
        { color: "#3182bd", name: ">=50 i <60", value: 50 },
        { color: "#6baed6", name: ">=40 i <50", value: 40 },
        { color: "#9ecae1", name: ">=30 i <40", value: 30 },
        { color: "#c6dbef", name: ">=20 i <30", value: 20 },
        { color: "#eff3ff", name: "< 20", value: 0 },
      ],
    },
    pcrpos: {
      title: "Percentatge de PCR positives a tota la població",
      label: "% PCR +",
      name: "Percentatge de PCR positives",
      colors: [
        { color: "#a50026", name: ">=40%", value: 40 },
        { color: "#d73027", name: ">=30% i <40%", value: 30 },
        { color: "#f46d43", name: ">=20% i <30%", value: 20 },
        { color: "#fdae61", name: ">=15% i <20%", value: 15 },
        { color: "#fee08b", name: ">=10% i <15%", value: 10 },
        { color: "#ffffbf", name: ">=8% i <10%", value: 8 },
        { color: "#66bd63", name: ">=5% i <8%", value: 5 },
        { color: "#1a9850", name: ">=3% i <5%", value: 3 },
        { color: "#006837", name: "<3%", value: 0 },
      ],
    },
    taxapcr: {
      title: "Taxa PCR per 100.000 habitants a tota la població",
      label: "Taxa PCR",
      name: "Taxa PCR per 100.000 habitants",
      colors: [
        { color: "#08306b", name: ">=1000", value: 1000 },
        { color: "#08519c", name: ">=800 i <1000", value: 800 },
        { color: "#2171b5", name: ">=600 i <800", value: 600 },
        { color: "#4292c6", name: ">=500 i <600", value: 500 },
        { color: "#6baed6", name: ">=400 i <500", value: 400 },
        { color: "#9ecae1", name: ">=300 i <400", value: 300 },
        { color: "#c6dbef", name: ">=200 i <300", value: 200 },
        { color: "#deebf7", name: ">=100 i <200", value: 100 },
        { color: "#f7fbff", name: "<100", value: 0 },
      ],
    },
  },
  kind: {
    Comarca: {
      svg: MapaComarques,
      values: {
        risc: comarcaRisc,
        taxa_conf: comarcaTaxa_conf,
        rt: comarcaRt,
        edat: comarcaEdat,
        pcrpos: comarcaPcrpos,
        taxapcr: comarcaTaxapcr,
      },
    },
    Municipi: {
      svg: MapaMunicipis,
      values: {
        risc: municipiRisc,
        taxa_conf: municipiTaxa_conf,
        rt: municipiRt,
        edat: municipiEdat,
        pcrpos: municipiPcrpos,
        taxapcr: municipiTaxapcr,
      },
    },
  },
};

export default MapDataStatic;
