export interface Measures {
  title: string;
  row: {
    name: string;
    prefix: string;
    measures: string[];
    isActive: boolean;
  };
  allMeasures: Measure[];
  measures: Measure[];
  lang: string;
  translations: any;
}

export interface Measure {
  measureNm: string;
  isActive: boolean;
}

export interface NewMeasure {
  measureNm: string;
  oldMeasureNm: string;
  isActive: boolean;
}
