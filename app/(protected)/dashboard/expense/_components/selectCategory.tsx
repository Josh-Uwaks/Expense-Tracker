

import { Category } from "@/app/types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  type CategoryOptions = {
    label: string,
    value: string
  }

  type SelectCategoryProp = {
    classname: string,
    name?: string,
    value?: string,
    onChange?: (value: string) => void,
    category?: CategoryOptions[]
  }

const SelectCategory = ({classname, name, value, onChange, category}: SelectCategoryProp) => {

    console.log({
        "category from selectcat": category
    })
   
    return (
        <Select name={name} value={value} onValueChange={onChange}>
            <SelectTrigger className={`${classname} mt-1`}>
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem disabled value="value">Select Category</SelectItem>
                {category?.map((item) => (
                    <SelectItem value={item.label} key={item.value}>{item.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SelectCategory