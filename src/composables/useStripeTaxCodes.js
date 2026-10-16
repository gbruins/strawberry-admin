export default function useStripeTaxCodes() {
    const whiteList = [
        {
            "id": "txcd_40060003",
            "object": "tax_code",
            "description": "Food and beverage products in a form suited for consumption on the premises of the vendor, described as prepared foods, ready-to-eat foods, or meals. Always utilize this PTC for heated foods, heated beverages, dispensed beverages, and foods sold with eating utensils.",
            "name": "Food for Immediate Consumption"
        },

        // general, catch-all. However, using a more specific tax code is preferred for better compliance.
        {
            "id": "txcd_99999999",
            "object": "tax_code",
            "description": "A physical good that can be moved or touched. Also known as tangible personal property.",
            "name": "General - Tangible Goods"
        },

        // drinks - non alcoholic
        {
            "id": "txcd_41030001",
            "object": "tax_code",
            "description": "Regular, unsweetened, non carbonated water sold in containers. Includes waters containing only natural flavors or essences. Does not include distilled water.",
            "name": "Bottled Water"
        },
        {
            "id": "txcd_41040002",
            "object": "tax_code",
            "description": "Carbonated non-alcoholic beverages that contain natural or artificial sweeteners, and zero natural fruit or vegetable juice, not including carbonated water. Includes energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Carbonated Soft Drinks - 0% Fruit or Vegetable juice"
        },
        {
            "id": "txcd_41040003",
            "object": "tax_code",
            "description": "Ready to drink non-carbonated beverage containing tea with natural or artificial sweeteners.",
            "name": "Bottled Tea - Non-Carbonated - Sweetened"
        },
        {
            "id": "txcd_41040004",
            "object": "tax_code",
            "description": "Bottled water for human consumption, containing natural or artificial sweeteners, non-carbonated. Waters containing zero calorie natural flavoring should be associated with the `Bottled Water` PTC.",
            "name": "Bottled water - Sweetened"
        },
        {
            "id": "txcd_41040005",
            "object": "tax_code",
            "description": "Bottled water for human consumption, containing natural or artificial sweeteners, carbonated. Carbonated waters containing zero calorie natural flavoring should be associated with either the `Bottled Water - Carbonated Artificially` PTC or the `Bottled Water - Carbonated Naturally` PTC.",
            "name": "Bottled water - Carbonated - Sweetened"
        },
        {
            "id": "txcd_41040008",
            "object": "tax_code",
            "description": "Non-carbonated, non-alcoholic beverages that contain sweeteners, and zero natural fruit or vegetable juice, such as sweetened cocktail mixes that can be combined with alcohol, but doesn't include flavored water.",
            "name": "Non-Carbonated Soft Drinks - 0% Fruit or Vegetable juice"
        },
        {
            "id": "txcd_41040009",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 1 - 9% natural vegetable juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 1 -9% Vegetable juice"
        },
        {
            "id": "txcd_41040010",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 1 - 9% natural fruit juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 1-9% Fruit juice"
        },
        {
            "id": "txcd_41040011",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 10 - 24% natural fruit juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 10-24% Fruit juice"
        },
        {
            "id": "txcd_41040012",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 10 - 24% natural vegetable juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 10-24% Vegetable juice"
        },
        {
            "id": "txcd_41040013",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 100% natural fruit or vegetable juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 100% Fruit or Vegetable juice"
        },
        {
            "id": "txcd_41040014",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 25 - 50% natural fruit juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 25-50% Fruit juice"
        },
        {
            "id": "txcd_41040015",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 25 - 50% natural vegetable juice. This does not flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 25-50% Vegetable juice"
        },
        {
            "id": "txcd_41040016",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 51 - 69% natural fruit juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 51-69% Fruit juice"
        },
        {
            "id": "txcd_41040017",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 51 - 69% natural vegetable juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 51-69% Vegetable juice"
        },
        {
            "id": "txcd_41040018",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 70 - 99% natural fruit juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 70-99% Fruit juice"
        },
        {
            "id": "txcd_41040019",
            "object": "tax_code",
            "description": "Carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 70 - 99% natural vegetable juice. This does not include flavored carbonated water. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Carbonated - 70-99% Vegetable juice"
        },
        {
            "id": "txcd_41040020",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 1 - 9% natural vegetable juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 1 -9% Vegetable juice"
        },
        {
            "id": "txcd_41040021",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 1 - 9% natural fruit juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 1-9% Fruit juice"
        },
        {
            "id": "txcd_41040022",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 10 - 24% natural fruit juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 10-24% Fruit juice"
        },
        {
            "id": "txcd_41040023",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 10 - 24% natural vegetable juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 10-24% Vegetable juice"
        },
        {
            "id": "txcd_41040024",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 100% natural fruit or vegetable juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 100% Fruit or Vegetable juice"
        },
        {
            "id": "txcd_41040025",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 25 - 50% natural fruit juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 25-50% Fruit juice"
        },
        {
            "id": "txcd_41040026",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 25 - 50% natural vegetable juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 25-50% Vegetable juice"
        },
        {
            "id": "txcd_41040027",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 51 - 69% natural fruit juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 51-69% Fruit juice"
        },
        {
            "id": "txcd_41040028",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 51 - 69% natural vegetable juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 51-69% Vegetable juice"
        },
        {
            "id": "txcd_41040029",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 70 - 99% natural fruit juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 70-99% Fruit juice"
        },
        {
            "id": "txcd_41040030",
            "object": "tax_code",
            "description": "Non-carbonated nonalcoholic beverages that contain natural or artificial sweeteners, and 70 - 99% natural vegetable juice. This does not include flavored water. This does include sweetened cocktail mixes that can be combined with alcohol. This does include beverages marketed as energy drinks that carry a Nutrition Facts label and contain a blend of energy enhancing ingredients.",
            "name": "Soft Drinks - Non-Carbonated - 70-99% Vegetable juice"
        },
        {
            "id": "txcd_41050001",
            "object": "tax_code",
            "description": "Ready to drink coffee based beverage containing milk or milk substitute.",
            "name": "Bottled coffee - Containing Milk or Milk Substitute"
        },
        {
            "id": "txcd_41050002",
            "object": "tax_code",
            "description": "Ready to drink coffee based beverage not containing milk, containing natural or artificial sweetener.",
            "name": "Bottled Coffee - No Milk - Sweetened"
        },
        {
            "id": "txcd_41050003",
            "object": "tax_code",
            "description": "Ready to drink coffee based beverage containing neither milk nor natural or artificial sweeteners.",
            "name": "Bottled Coffee - No Milk - Unsweetened"
        },
        {
            "id": "txcd_41050004",
            "object": "tax_code",
            "description": "Ready to drink carbonated beverage containing tea and without any natural or artificial sweeteners.",
            "name": "Bottled Tea - Carbonated - Unsweetened"
        },
        {
            "id": "txcd_41050005",
            "object": "tax_code",
            "description": "Ready to drink non-carbonated beverage containing tea without natural or artificial sweeteners.",
            "name": "Bottled Tea - Non-Carbonated - Unsweetened"
        },

        // Clothing and footwear
        {
            "id": "txcd_30011000",
            "object": "tax_code",
            "description": "Apparel and footwear for people made for general use.",
            "name": "Clothing & Footwear"
        },
        {
            "id": "txcd_30011200",
            "object": "tax_code",
            "description": "Children's clothing and footwear including general purpose articles intended to be worn by a person based on certain size or age requirements.",
            "name": "Children's clothing and footwear"
        },
        {
            "id": "txcd_30060006",
            "object": "tax_code",
            "description": "A shaped covering for the head worn for warmth, as a fashion item, or as part of a uniform.",
            "name": "Hats"
        }
    ];

    function getWhiteList() {
        return [...whiteList];
    }

    function getDescriptionForTaxCode(taxCode) {
        const item = whiteList.find(i => i.id === taxCode);
        return item?.description || null;
    }

    return {
        getWhiteList,
        getDescriptionForTaxCode
    };
}
