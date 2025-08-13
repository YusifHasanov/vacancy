package com.azdev.hirgobackend.enums;

import lombok.Getter;

@Getter
public enum CategoryType {
    IT("IT"),
    MARKETING("Marketing"),
    EDUCATION("Təhsil"),
    FINANCE("Maliyyə"),
    HEALTHCARE("Səhiyyə"),
    ENGINEERING("Mühəndislik"),
    SALES_AND_MARKETING("Satış və Marketinq"),
    DESIGN_AND_CREATIVITY("Dizayn və Yaradıcılıq"),
    LAW("Hüquq"),
    TOURISM_AND_HOSPITALITY("Turizm və Qonaqpərvərlik"),
    ADMINISTRATIVE_JOBS("İnzibati işlər"),
    CONSTRUCTION_AND_ARCHITECTURE("Tikinti və Memarlıq"),
    TRANSPORT_AND_LOGISTICS("Nəqliyyat və Logistika"),
    CUSTOMER_SERVICE("Müştəri Xidməti"),
    MEDIA_AND_COMMUNICATION("Media və Kommunikasiya");

    private final String displayName;

    CategoryType(String displayName) {
        this.displayName = displayName;
    }

}