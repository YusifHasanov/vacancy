import { useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// @ts-expect-error
const formatDate = (date) => {
  return date ? format(date, "PPP") : "Tarix seç";
};

const cities = [
    'Bakı',
    'Gəncə',
    'Sumqayıt',
    'Mingəçevir',
    'Lənkəran',
    'Şəki',
    'Yevlax',
    'Göyçay',
    'Quba',
    'Qusar',
    'İsmayıllı',
    'Astara',
    'Qazax',
    'Tovuz',
    'Balakən',
    'Zaqatala',
    'Şamaxı',
    'Ağdam',
    'Ağdaş',
    'Ağcabədi',
    'Ağsu',
    'Bərdə',
    'Biləsuvar',
    'Cəlilabad',
    'Cəbrayıl'
]

const categories = [
    'IT',
    'Maliyyə',
    'Marketinq',
    'Mühəndislik',
    'Tibb',
    'İdarəetmə',
    'Mühasibat',
    'İnsan Resursları',
    'Dizayn',
    'Müəllim',
    'Sürücü',
    'Satış',
    'Xidmət',
    'Sənaye'
]

export default function AddVacancy() {
    const { register, handleSubmit, control, reset } = useForm()
    const [isSalaryByAgreement, setIsSalaryByAgreement] = useState(false)

    //@ts-expect-error
    const onSubmit = (data) => {
        console.log(data)
        // Here you would typically send this data to your backend
    }

    const handleReset = () => {
        reset();
        setIsSalaryByAgreement(false);
    };

    const { field } = useController({
        name: 'deadline',
        control,
        rules: { required: true },
    })

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Yeni vakansiya əlavə et</CardTitle>
                    <CardDescription>Aşağıdakı məlumatları doldurun.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Kateqoriya</Label>
                            <Select onValueChange={(value) => register('category').onChange({target: {value}})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Kateqoriya seç"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">Şəhər</Label>
                            <Select onValueChange={(value) => register('city').onChange({target: {value}})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Şəhər seç"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salary">Maaş</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    placeholder="Maaş daxil edin"
                                    {...register('salary')}
                                    disabled={isSalaryByAgreement}
                                />
                                <div className="flex items-center space-x-2">

                                    <Checkbox
                                        id="salaryByAgreement"
                                        checked={isSalaryByAgreement}
                                        onCheckedChange={(checked) => {
                                            //@ts-expect-error
                                            setIsSalaryByAgreement(checked)
                                            if (checked) {
                                                register('salary').onChange({target: {value: 'Razılaşma yolu ilə'}})
                                            }
                                        }}
                                    />
                                    <label htmlFor="salaryByAgreement">Razılaşma yolu ilə</label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Məzmun</Label>
                            <Textarea placeholder="Məzmun" {...register('description')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duties">Vəzifə və öhdəliklər</Label>
                            <Textarea placeholder="Vəzifə və öhdəliklər" {...register('duties')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="education">Təhsil və ixtisas tələbləri Requests</Label>
                            <Textarea placeholder="Təhsil və ixtisas tələbləri" {...register('education')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">İş təcrübəsi</Label>
                            <Input placeholder="İş təcrübəsi" {...register('experience')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills">Bilik və bacarıqlar</Label>
                            <Textarea placeholder="Bilik və bacarıqlar" {...register('skills')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="superiority">Üstünlük verilir</Label>
                            <Textarea placeholder="Üstünlük verilir." {...register('superiority')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Başlıq</Label>
                            <Input placeholder="Vakansiya başlığı" {...register('title')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Son tarix</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {formatDate(field.value)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            field.onChange(date);
                                            // Close the popover after selection
                                            document.body.click();
                                        }}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex justify-between">
                            <Button type="submit">Yarat</Button>
                            <Button type="button" variant="outline" onClick={handleReset}>Sıfırla</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

