// DatePicker.tsx veya ResumeForm.tsx dosyasının içine

import React, { useState, useEffect } from "react";
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value: string; // "YYYY-MM" veya "YYYY" gibi bir string
    onChange: (value: string) => void;
    placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);

    // Input alanının değerini tutmak için yerel bir state.
    // Başlangıç değeri, prop olarak gelen value'dan alınır.
    const [inputValue, setInputValue] = useState(value);

    // Prop olarak gelen 'value' değiştiğinde input'u da güncelle.
    // Bu, dışarıdan gelen değişikliklerin bileşene yansımasını sağlar.
    useEffect(() => {
        setInputValue(value);
    }, [value]);


    // String'i Date nesnesine güvenli bir şekilde çevirme denemesi
    const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
    const isValidDate = selectedDate && !isNaN(selectedDate.getTime());

    return (
        <div className="relative">
            <Input
                value={inputValue}
                placeholder={placeholder || "YYYY-MM"}
                className="pr-10" // İkon için yer aç
                onChange={(e) => {
                    setInputValue(e.target.value); // Kullanıcı yazarken input'u anında güncelle
                }}
                onBlur={() => {
                    // Kullanıcı input'tan ayrıldığında ana state'i güncelle
                    onChange(inputValue);
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-7 -translate-y-1/2 p-0"
                        aria-label="Open calendar"
                    >
                        <CalendarIcon className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={isValidDate ? selectedDate : undefined}
                        onSelect={(date) => {
                            if (date) {
                                const formattedDate = format(date, 'yyyy-MM-dd');
                                onChange(formattedDate);
                                setInputValue(formattedDate); // Input'u da güncelle
                            }
                            setOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );


};

export default DatePicker;
