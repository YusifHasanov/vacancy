<?php

namespace App\Enums;

enum CategoryName: string
{
    case IT = 'IT';
    case MARKETING = 'Marketing';
    case EDUCATION = 'Təhsil';
    case FINANCE = 'Maliyyə';
    case HEALTHCARE = 'Səhiyyə';
    case ENGINEERING = 'Mühəndislik';
    case SALES_AND_MARKETING = 'Satış və Marketinq';
    case DESIGN_AND_CREATIVITY = 'Dizayn və Yaradıcılıq';
    case LAW = 'Hüquq';
    case TOURISM_AND_HOSPITALITY = 'Turizm və Qonaqpərvərlik';
    case ADMINISTRATIVE_JOBS = 'İnzibati işlər';
    case CONSTRUCTION_AND_ARCHITECTURE = 'Tikinti və Memarlıq';
    case TRANSPORT_AND_LOGISTICS = 'Nəqliyyat və Logistika';
    case CUSTOMER_SERVICE = 'Müştəri Xidməti';
    case MEDIA_AND_COMMUNICATION = 'Media və Kommunikasiya';
}
