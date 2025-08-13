package com.azdev.hirgobackend.enums;

import lombok.Getter;

@Getter
public enum Location {
    BAKU("Bakı"),
    GANJA("Gəncə"),
    SUMGAIT("Sumqayıt"),
    MINGACHEVIR("Mingəçevir"),
    SHAMAKHI("Şamaxı"),
    GUBA("Quba"),
    SHAKI("Şəki"),
    LANKARAN("Lənkəran"),
    NAKHCHIVAN("Naxçıvan"),
    GAZAKH("Qazax"),
    AGDAM("Ağdam"),
    AGDASH("Ağdaş"),
    AGSU("Ağsu"),
    ASTARA("Astara"),
    BALAKAN("Balakən"),
    BARDAA("Bərdə"),
    BEYLQAN("Beyləqan"),
    BILASUVAR("Biləsuvar"),
    DASHKESAN("Daşkəsən"),
    FIZULI("Füzuli"),
    GADABEY("Gədəbəy"),
    GORANBOY("Goranboy"),
    HACIQABUL("Hacıqabul"),
    IMISHLI("İmişli"),
    ISMAYILLI("İsmayıllı"),
    KURDAMIR("Kürdəmir"),
    LERIK("Lerik"),
    MASALLI("Masallı"),
    YEVLAKH("Yevlax"),
    ZARDAB("Zərdab"),
    SABIRABAD("Sabirabad"),
    SADARAK("Sədərək"),
    SAATLI("Saatlı"),
    SABRAN("Sabran"),
    SIAZAN("Siyəzən"),
    ZAQATALA("Zaqatala"),
    ZANGILAN("Zəngilan");

    private final String displayName;

    Location(String displayName) {
        this.displayName = displayName;
    }

}