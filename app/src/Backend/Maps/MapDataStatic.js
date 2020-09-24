/*
   Static maps data (not updated each day)

   Includes data sources, kinds and values lists and metadata
*/
const MapStaticHost = process.env.REACT_APP_MAP_STATIC_HOST;

const days              = `${MapStaticHost}/days.json`;

const MapaComarques     = `${MapStaticHost}/Comarca.svg`;
const MapaMunicipis     = `${MapStaticHost}/Municipi.svg`;

const comarcaEdat       = `${MapStaticHost}/MapData-Comarca-edat.json`;
const comarcaPcrpos     = `${MapStaticHost}/MapData-Comarca-pcrpos.json`;
const comarcaRisc       = `${MapStaticHost}/MapData-Comarca-risc.json`;
const comarcaRt         = `${MapStaticHost}/MapData-Comarca-rt.json`;
const comarcaTaxa_conf  = `${MapStaticHost}/MapData-Comarca-taxa_conf.json`;
const comarcaTaxapcr    = `${MapStaticHost}/MapData-Comarca-taxapcr.json`;

const municipiEdat      = `${MapStaticHost}/MapData-Municipi-edat.json`;
const municipiPcrpos    = `${MapStaticHost}/MapData-Municipi-pcrpos.json`;
const municipiRisc      = `${MapStaticHost}/MapData-Municipi-risc.json`;
const municipiRt        = `${MapStaticHost}/MapData-Municipi-rt.json`;
const municipiTaxa_conf = `${MapStaticHost}/MapData-Municipi-taxa_conf.json`;
const municipiTaxapcr   = `${MapStaticHost}/MapData-Municipi-taxapcr.json`;

const MapDataStatic = {
  days,
  metadata: {
    risc: {
      title: "Risc de rebrot (iEPG) a població general",
      label: "Risc de rebrot (iEPG)",
      name: "Risc de rebrot (iEPG)",
      colors: [
        {"color": "#400", "nom": "Risc màxim", "valor": 210},
        {"color": "#800", "nom": "Risc extrem", "valor": 190},
        {"color": "#c00", "nom": "Risc altíssim", "valor": 160},
        {"color": "#f00", "nom": "Risc molt alt", "valor": 130},
        {"color": "#f40", "nom": "Risc alt", "valor": 100},
        {"color": "#f80", "nom": "Risc mitjà-alt", "valor": 70},
        {"color": "#fc0", "nom": "Risc mitjà", "valor": 50},
        {"color": "#ff0", "nom": "Risc mitjà-baix", "valor": 30},
        {"color": "#cf0", "nom": "Risc baix", "valor": 15},
        {"color": "#8f4", "nom": "Risc molt baix", "valor": 5},
        {"color": "#4f8", "nom": "Risc no nul", "valor": 1},
        {"color": "#0fc", "nom": "Risc mínim", "valor": 0},
      ],
    },
    taxa_conf: {
      title: "Taxa setmanal de casos confirmats PCR a tota la població",
      label: "Taxa confirmats per PCR",
      name: "Taxa setmanal de casos confirmats PCR",
      colors: [
        {"color": "#a00", "nom": ">=300", "valor": 300},
        {"color": "#d00", "nom": ">=200 i <300", "valor": 200},
        {"color": "#f00", "nom": ">=100 i <200", "valor": 100},
        {"color": "#f80", "nom": ">=75 i <100", "valor": 75},
        {"color": "#fa0", "nom": ">=50 i <75", "valor": 50},
        {"color": "#fc0", "nom": ">=25 i <50", "valor": 25},
        {"color": "#0b0", "nom": ">=15 i <25", "valor": 15},
        {"color": "#090", "nom": "<15", "valor": 0}
      ],
    },
    rt: {
      title: "Velocitat de propagació (Rt) a població general",
      label: "Rt",
      name: "Velocitat de propagació (Rt)",
      colors: [
        {"color": "#f00", "nom": ">=2", "valor": 2},
        {"color": "#f70", "nom": ">=1.5 i <2", "valor": 1.5},
        {"color": "#fa0", "nom": ">=1.2 i <1.5", "valor": 1.2},
        {"color": "#fc0", "nom": ">1 i <1.2", "valor": 1.00001},
        {"color": "#0a0", "nom": "<=1", "valor": 0}
      ],
    },
    edat: {
      title: "Mitjana d'edat dels casos confirmats per PCR a tota la població",
      label: "Mitjana edat",
      name: "Mitjana d'edat dels casos confirmats per PCR",
      colors: [
        {"color": "#08519c", "nom": ">=60", "valor": 60},
        {"color": "#3182bd", "nom": ">=50 i <60", "valor": 50},
        {"color": "#6baed6", "nom": ">=40 i <50", "valor": 40},
        {"color": "#9ecae1", "nom": ">=30 i <40", "valor": 30},
        {"color": "#c6dbef", "nom": ">=20 i <30", "valor": 20},
        {"color": "#eff3ff", "nom": "< 20", "valor": 0}
      ],
    },
    pcrpos: {
      title: "Percentatge de PCR positives a tota la població",
      label: "% PCR +",
      name: "Percentatge de PCR positives",
      colors: [
        {"color": "#a50026", "nom": ">=40%", "valor": 40},
        {"color": "#d73027", "nom": ">=30% i <40%", "valor": 30},
        {"color": "#f46d43", "nom": ">=20% i <30%", "valor": 20},
        {"color": "#fdae61", "nom": ">=15% i <20%", "valor": 15},
        {"color": "#fee08b", "nom": ">=10% i <15%", "valor": 10},
        {"color": "#ffffbf", "nom": ">=8% i <10%", "valor": 8},
        {"color": "#66bd63", "nom": ">=5% i <8%", "valor": 5},
        {"color": "#1a9850", "nom": ">=3% i <5%", "valor": 3},
        {"color": "#006837", "nom": "<3%", "valor": 0}
      ],
    },
    taxapcr: {
      title: "Taxa PCR per 100.000 habitants a tota la població",
      label: "Taxa PCR",
      name: "Taxa PCR per 100.000 habitants",
      colors: [
        {"color": "#08306b", "nom": ">=1000", "valor": 1000},
        {"color": "#08519c", "nom": ">=800 i <1000", "valor": 800},
        {"color": "#2171b5", "nom": ">=600 i <800", "valor": 600},
        {"color": "#4292c6", "nom": ">=500 i <600", "valor": 500},
        {"color": "#6baed6", "nom": ">=400 i <500", "valor": 400},
        {"color": "#9ecae1", "nom": ">=300 i <400", "valor": 300},
        {"color": "#c6dbef", "nom": ">=200 i <300", "valor": 200},
        {"color": "#deebf7", "nom": ">=100 i <200", "valor": 100},
        {"color": "#f7fbff", "nom": "<100", "valor": 0}
      ],
    },
  },
  kind: {
    Comarca: {
      svg: MapaComarques,
      values: {
        risc:      comarcaRisc,
        taxa_conf: comarcaTaxa_conf,
        rt:        comarcaRt,
        edat:      comarcaEdat,
        pcrpos:    comarcaPcrpos,
        taxapcr:   comarcaTaxapcr
      }
    },
    Municipi: {
      svg: MapaMunicipis,
      values: {
        risc:      municipiRisc,
        taxa_conf: municipiTaxa_conf,
        rt:        municipiRt,
        edat:      municipiEdat,
        pcrpos:    municipiPcrpos,
        taxapcr:   municipiTaxapcr
      }
    }
  }
};

export default MapDataStatic;
