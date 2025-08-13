'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { useCategories } from '@/app/features/category/useCategory'
import { 
  useLocations, 
  useEmploymentTypes, 
  useWorkSchedules 
} from '@/app/features/lookup/useLookupHooks'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface FiltersProps {
    onFilterChange: (key: string, value: string) => void
    onApplyFilters?: () => void
    className?: string
}

export function Filters({ onFilterChange, onApplyFilters, className = "" }: FiltersProps) {
    // Get lookup data
    const { lookups: locations, isLoading: isLocationsLoading } = useLocations();
    const { lookups: employmentTypes, isLoading: isEmploymentTypesLoading } = useEmploymentTypes();
    const { lookups: workSchedules, isLoading: isWorkSchedulesLoading } = useWorkSchedules();
    const { categories, isLoading: isCategoriesLoading } = useCategories();

    // State for filter values
    const [locationValue, setLocationValue] = useState<string>("");
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [minSalaryValue, setMinSalaryValue] = useState<string>("");
    const [maxSalaryValue, setMaxSalaryValue] = useState<string>("");
    const [employmentTypeValue, setEmploymentTypeValue] = useState<string>("");
    const [workScheduleValue, setWorkScheduleValue] = useState<string>("");
    const [postingDateValue, setPostingDateValue] = useState<string>("");

    const handleFilterChange = (key: string, value: string) => {
        // Update local state
        switch(key) {
            case "location":
                setLocationValue(value);
                break;
            case "category":
                setCategoryValue(value);
                break;
            case "minSalary":
                setMinSalaryValue(value);
                break;
            case "maxSalary":
                setMaxSalaryValue(value);
                break;
            case "employmentType":
                setEmploymentTypeValue(value);
                break;
            case "workSchedule":
                setWorkScheduleValue(value);
                break;
            case "postingDate":
                setPostingDateValue(value);
                break;
        }
        
        // Pass to parent component
        onFilterChange(key, value);
    };

    const resetFilters = () => {
        setLocationValue("");
        setCategoryValue("");
        setMinSalaryValue("");
        setMaxSalaryValue("");
        setEmploymentTypeValue("");
        setWorkScheduleValue("");
        setPostingDateValue("");
        
        // Reset all filters in parent component
        handleFilterChange("location", "");
        handleFilterChange("category", "");
        handleFilterChange("minSalary", "");
        handleFilterChange("maxSalary", "");
        handleFilterChange("employmentType", "");
        handleFilterChange("workSchedule", "");
        handleFilterChange("postingDate", "");
    };

    const applyFilters = () => {
        if (onApplyFilters) {
            onApplyFilters();
        }
    };

    return (
        <div className={`space-y-4 ${className} gap-4 lg:overflow-x-auto lg:h-[calc(100vh-170px)] `}>
            <div className="flex items-center justify-between">
                <h2 className="font-medium text-lg">Filterlər</h2>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Yer (Şəhər/Bölgə/Ölkə)</Label>
                        <Select 
                            value={locationValue} 
                            onValueChange={(value) => handleFilterChange("location", value)}
                        >
                            <SelectTrigger id="location">
                                <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Hamısı</SelectItem>
                                {isLocationsLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Loading...</span>
                                    </div>
                                ) : locations && locations.length === 0 ? (
                                    <SelectItem value="none" disabled>No options available</SelectItem>
                                ) : locations && locations.map(location => (
                                    <SelectItem key={location.id} value={location.id.toString()}>
                                        {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">İş Sahəsi (Kateqoriya)</Label>
                        <Select 
                            value={categoryValue} 
                            onValueChange={(value) => handleFilterChange("category", value)}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Hamısı</SelectItem>
                                {isCategoriesLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Loading...</span>
                                    </div>
                                ) : categories && categories.length === 0 ? (
                                    <SelectItem value="none" disabled>No options available</SelectItem>
                                ) : categories && categories.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Maaş</Label>
                        <div className="flex space-x-2">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={minSalaryValue}
                                    onChange={(e) => handleFilterChange("minSalary", e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={maxSalaryValue}
                                    onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="employmentType">İş Növü</Label>
                        <Select 
                            value={employmentTypeValue} 
                            onValueChange={(value) => handleFilterChange("employmentType", value)}
                        >
                            <SelectTrigger id="employmentType">
                                <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Hamısı</SelectItem>
                                {isEmploymentTypesLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Loading...</span>
                                    </div>
                                ) : employmentTypes && employmentTypes.length === 0 ? (
                                    <SelectItem value="none" disabled>No options available</SelectItem>
                                ) : employmentTypes && employmentTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="workSchedule">İş Qrafiki</Label>
                        <Select 
                            value={workScheduleValue} 
                            onValueChange={(value) => handleFilterChange("workSchedule", value)}
                        >
                            <SelectTrigger id="workSchedule">
                                <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Hamısı</SelectItem>
                                {isWorkSchedulesLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Loading...</span>
                                    </div>
                                ) : workSchedules && workSchedules.length === 0 ? (
                                    <SelectItem value="none" disabled>No options available</SelectItem>
                                ) : workSchedules && workSchedules.map(schedule => (
                                    <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                        {schedule.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postingDate">Vakansiyanın Tarixi</Label>
                        <Select 
                            value={postingDateValue} 
                            onValueChange={(value) => handleFilterChange("postingDate", value)}
                        >
                            <SelectTrigger id="postingDate">
                                <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Hamısı</SelectItem>
                                <SelectItem value="LAST_WEEK">Son bir həftə</SelectItem>
                                <SelectItem value="LAST_MONTH">Son bir ay</SelectItem>
                                <SelectItem value="NEW">Yeni yerləşdirilənlər</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="flex space-x-2">
                    <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={resetFilters}
                    >
                        Sıfırla
                    </Button>
                    <Button 
                        className="flex-1"
                        onClick={applyFilters}
                    >
                        Tətbiq et
                    </Button>
                </div>
            </div>
        </div>
    )
}
