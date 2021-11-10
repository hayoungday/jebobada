import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function TypeChooser(props) {
  const [type, setType] = React.useState("");
  const handleChange = (event) => {
    
    props.getType(event.target.value)
    setType(event.target.value);
  };
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel htmlFor="grouped-native-select">괴롭힘 유형 선택</InputLabel>
        <Select
          autoWidth
          native
          defaultValue="dd"
          id="grouped-native-select"
          label="Grouping"
          onChange={handleChange}
        >
          <option aria-label="None" value="" />
          <optgroup label="신체적 괴롭힘">
            <option value={"폭행"}>폭행</option>
          </optgroup>
          <optgroup label="언어적 괴롭힘">
            <option value={"폭언"}>폭언</option>
            <option value={"모욕"}>모욕</option>
            <option value={"협박"}>협박</option>
            <option value={"비하"}>비하</option>
          </optgroup>3
          <optgroup label="업무적 괴롭힘">
            <option value={"무시"}>무시</option>
            <option value={"정보차단"}>정보차단</option>
            <option value={"차단"}>차단</option>
            <option value={"배제"}>배제</option>
            <option value={"사적지시"}>사적지시</option>
            <option value={"전가"}>전가</option>
            <option value={"업무제외"}>업무제외</option>
            <option value={"SNS"}>SNS</option>
            <option value={"초과근무"}>초과근무</option>
            <option value={"건의"}>건의</option>
            <option value={"감시"}>감시</option>
            <option value={"사직종용"}>사직종용</option>
            <option value={"제출강요"}>제출강요</option>
            <option value={"차별"}>차별</option>
            <option value={"사비"}>사비</option>
          </optgroup>
          <optgroup label="업무 외 괴롭힘">
            <option value={"행사"}>행사</option>
            <option value={"장기자랑강요"}>장기자랑 강요</option>
            <option value={"강요"}>강요</option>
            <option value={"후원강요"}>후원 강요</option>
            <option value={"휴가"}>휴가</option>
            <option value={"육아휴직"}>육아휴직</option>
            <option value={"모임"}>모임</option>
            <option value={"실업급여"}>실업급여</option>
          </optgroup>
          <optgroup label="집단적 괴롭힘">
            <option value={"따돌림"}>따돌림</option>
            <option value={"소문"}>소문</option>
            <option value={"비밀"}>비밀</option>
            <option value={"태움"}>태움</option>
          </optgroup>
          <optgroup label="성희롱">
            <option value={"성희롱"}>성희롱</option>
          </optgroup>
        </Select>
      </FormControl>
    </div>
  );
}