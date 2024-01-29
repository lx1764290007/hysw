import "./valid-code.css";
import React, {useEffect} from "react";
import {useSafeState} from "ahooks";

const defaultTotal = 4;
const codeSprite = "data:image/jpeg;base64,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";

const getStyleX = (x) => {
  return (-(x === 0 ? 9 : x - 1) * 25) + (x > 0 && x <= 8 ? 3 : x > 8 ? 1 : 0);
};

const valid = (target) => {
  if (!(target instanceof Array)) {
    console.error("ValidCode: defaultValue 不是一个有效的参数类型，正确参数类型：number[]");
    return;
  }
  const isInvalidNumber = target?.some((item) => isNaN(item));
  isInvalidNumber && console.warn("ValidCode: defaultValue 不是一个有效的参数类型，正确参数类型：number[]");
  if (!isInvalidNumber) {
    const maxNum = Math.max(...target); const minNum = Math.min(...target);
    if (maxNum > 9 || minNum < 0) {
      console.error("ValidCode: number[]里面最大值是9，最小值为0;");
      return;
    }
    return target;
  }
};
const getRandomArrayNumber = function(n = defaultTotal) {
  let result = [];
  for (let x = 0; x < n; x++) {
    const r = Math.floor(Math.random() * 10);
    result.push(r);
  }
  return result;
};

export const ValidCode = (props) => {
  const [values, setValues] = useSafeState(props.defaultValue || getRandomArrayNumber(props.total ?? defaultTotal));
  const [wrapperWidth, setWidth] = useSafeState(25 * (props.total ?? props.defaultValue?.length ?? defaultTotal) + 8);
  useEffect(() => {
    const res = valid(props.defaultValue || []);
    if (res && res.length > 0) {
      setValues(res);
    }
    // eslint-disable-next-line
    }, [props.defaultValue]);

  useEffect(() => {
    setWidth(25 * (props.total ?? defaultTotal) + 8);
    // eslint-disable-next-line
    }, [props.total]);

  const onRefresh = () => {
    const target = getRandomArrayNumber(props.total ?? defaultTotal);
    setValues(target);
  };

  useEffect(() => {
    props.onChange?.(values);
    // eslint-disable-next-line
    }, [values])

  React.useImperativeHandle(props.onRef, () => {
    return {
      onRefresh
    };
  });

  return (
    <div className="code-sprite" style={props.style}>
      <div className="code-sprite-wrapper" onClick={onRefresh} title={"点击重新生成"}
        style={{width: wrapperWidth}}>
        {
          values.map((item, i) => {
            return (props.total ? i < props.total : i < defaultTotal) &&
                            <div className="code-sprite-item" key={item + Math.random().toFixed(5)}>
                              <img src={codeSprite} alt={"code"}
                                style={{transform: `translateX(${getStyleX(item)}px) rotateZ(${item % 2 === 0 ? -item/3 : item/3}deg)`}}/>
                            </div>;
          })
        }
      </div>
    </div>
  );
};
