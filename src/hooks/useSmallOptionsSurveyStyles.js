import {useEffect} from "react";

export function useSmallOptionsSurveyStyles(options, setIsSmallOptionsStylesUsed, optionsRef) {
    useEffect(() => {
      let optionRows = [].slice.call(optionsRef.current)
        .filter(item => options.find(option => option.text === item.childNodes[1].innerHTML));
      const SINGLE_ROW_OPTION_HEIGHT = 50;
      const isNotSingleRowOptionExist = !!optionRows.find(option => option.offsetHeight > SINGLE_ROW_OPTION_HEIGHT);
      setIsSmallOptionsStylesUsed(!isNotSingleRowOptionExist)
  }, [window.innerWidth, options])
}
