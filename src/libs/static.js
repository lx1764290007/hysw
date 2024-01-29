export const TYPE = {
  ALARM: "报警",
  OFF_LINE: "离线",
  ON_LINE: "在线",
  ABNORMAL: "异常"
};
export const TYPE_COLOR = {
  ALARM: "red",
  OFF_LINE: "#868686",
  ON_LINE: "green",
  ABNORMAL: "orange"
};
export const getAlertColor = (state)=> state? TYPE_COLOR.ON_LINE:TYPE_COLOR.OFF_LINE;
export const getType = (state)=> state? TYPE.ON_LINE:TYPE.OFF_LINE;
export const randomType = {
  type() {
    const type = Object.keys(TYPE);
    const LENGTH = 4;
    const random = Math.floor(Math.random() * LENGTH);
    return type[random];
  }
};

export const TRIGGER_ALARM_GRADE = [
  {
    label: "低",
    value: "low",
    color: "#ec9d74"
  },
  {
    label: "中",
    value: "medium",
    color: "#de7b44"
  },
  {
    label: "重",
    value: "serious",
    color: "#ef6113"
  },
  {
    label: "紧急",
    value: "emergent",
    color: "#fc4300"
  }
];
