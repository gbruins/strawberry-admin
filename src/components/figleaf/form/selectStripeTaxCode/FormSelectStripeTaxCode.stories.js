import { ref } from 'vue';
import { FigFormSelectStripeTaxCode } from '../../../../index.js';
import {
    formInputSizes
} from '../inputConstants.js';

export default {
    title: 'Components/Form/SelectStripeTaxCode',
    component: FigFormSelectStripeTaxCode,
    argTypes: {
        size: {
            control: { type: 'select' },
            options: Object.keys(formInputSizes)
        },

        clearable: {
            control: {
                type: 'boolean'
            }
        },

        state: {
            control: {
                type: 'boolean'
            }
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
        FigFormSelectStripeTaxCode,
    },
    setup() {
        const selected = ref(null);

        return {
            selected,
            args
        };
    },
    template: `
        <div>
            <fig-form-select-stripe-tax-code
                v-model="selected"
                :tax-codes="taxCodes"
                v-bind="args" />

            <div class="mt-6">Selected: {{ selected }}</div>
        </div>
    `
});

export const FormSelectStripeTaxCode = Template.bind({});
FormSelectStripeTaxCode.storyName = "SelectStripeTaxCode";
FormSelectStripeTaxCode.args = {
    size: formInputSizes.md,
    whiteList: [
        'txcd_00000000', // Nontaxable
        'txcd_99999999', // General - Tangible goods
        'txcd_30011000', // Clothing and footwear
        'txcd_30011200', // Children's clothing and footwear
        'txcd_30060006', // Hats
        'txcd_30060007', // Jewelry
        'txcd_35010000', // Books
        'txcd_30060010', // Non-clothing accessories
    ],
    taxCodes: [
        {
          "id": "txcd_99999999",
          "object": "tax_code",
          "description": "Any tangible or physical good. For jurisdictions that impose a tax, the standard rate is applied.",
          "name": "General - Tangible Goods"
        },
        {
          "id": "txcd_20030000",
          "object": "tax_code",
          "description": "Miscellaneous services. This code will only treat services as taxable if the jurisdiction taxes services generally.",
          "name": "General - Services"
        },
        {
          "id": "txcd_10000000",
          "object": "tax_code",
          "description": "Any electronically supplied good or service.",
          "name": "General - Electronically Supplied Services"
        },
        {
          "id": "txcd_00000000",
          "object": "tax_code",
          "description": "Any nontaxable good or service which can be used to ensure no tax is applied, even for jurisdictions that impose a tax.",
          "name": "Nontaxable"
        },
        {
          "id": "txcd_10010001",
          "object": "tax_code",
          "description": "Cloud service offering infrastructure resources (specifically server storage, RAM, and CPU usage) over the internet. This offering is intended for personal use, rather than for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Infrastructure as a service (IaaS) - personal use"
        },
        {
          "id": "txcd_10101000",
          "object": "tax_code",
          "description": "Cloud service offering infrastructure resources (specifically server storage, RAM, and CPU usage) over the internet. This offering is intended for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Infrastructure as a service (IaaS) - business use"
        },
        {
          "id": "txcd_10102000",
          "object": "tax_code",
          "description": "Cloud service providing a platform for users to develop, run, and manage applications. This offering is intended for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Platform as a service (PaaS) - business use"
        },
        {
          "id": "txcd_10102001",
          "object": "tax_code",
          "description": "Cloud service providing a platform for users to develop, run, and manage applications. This offering is intended for personal use, rather than for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Platform as a Service (PaaS) - personal use"
        },
        {
          "id": "txcd_10103000",
          "object": "tax_code",
          "description": "Cloud services software delivered over the internet. The software isn't customized for a specific buyer and they don't download anything. The software is intended for personal use, rather than for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Software as a service (SaaS) - personal use"
        },
        {
          "id": "txcd_10103001",
          "object": "tax_code",
          "description": "Cloud services software delivered over the internet. The software isn't customized for a specific buyer and they don't download anything. The software is intended for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Software as a service (SaaS) - business use"
        },
        {
          "id": "txcd_10103100",
          "object": "tax_code",
          "description": "Cloud services software delivered over the internet. The software isn't customized for a specific buyer and this model assumes an electronic transfer to the buyer, such as an app download.  The software is intended for personal use, rather than for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Software as a service (SaaS) -- electronic download - personal use"
        },
        {
          "id": "txcd_10103101",
          "object": "tax_code",
          "description": "Cloud services software delivered over the internet. The software isn't customized for a specific buyer and this model assumes an electronic transfer to the buyer, such as an app download.  The software is intended for use by a commercial enterprise. Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Software as a service (SaaS) -- electronic download - business use"
        },
        {
          "id": "txcd_10104001",
          "object": "tax_code",
          "description": "Cloud service providing business process outsourcing services over the internet.",
          "name": "Cloud-based business process as a service"
        },
        {
          "id": "txcd_10201000",
          "object": "tax_code",
          "description": "​​Prewritten (\"canned\") software the the buyer downloads. This model assumes the software is for entertainment or amusement purposes and not for business purposes (e.g., word processing or antivirus software).",
          "name": "Downloadable games"
        },
        {
          "id": "txcd_10202000",
          "object": "tax_code",
          "description": "Prewritten (\"canned\") software that the buyer downloads. The software is intended for personal use, rather than for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Downloadable software - personal use"
        },
        {
          "id": "txcd_10202001",
          "object": "tax_code",
          "description": "Prewritten (\"canned\") software that the buyer downloads used for non-recreational purposes, such as antivirus, database, educational, financial, word processing, etc. The software is intended for personal use, rather than for consumption in a commercial enterprise.  Note: The distinction between business use and personal use for this tax code is relevant only if you are transacting business in the US.",
          "name": "Downloadable software - non-recreational"
        },
        {
          "id": "txcd_10202003",
          "object": "tax_code",
          "description": "Prewritten (\"canned\") software that the buyer downloads. The software is intended for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Downloadable software - business use"
        },
        {
          "id": "txcd_10203000",
          "object": "tax_code",
          "description": "Custom software that the buyer downloads. The software is intended for personal use, rather than for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Downloadable software - custom - personal use"
        },
        {
          "id": "txcd_10203001",
          "object": "tax_code",
          "description": "Custom software that the buyer downloads. The software is intended for use by a commercial enterprise.  Note: The distinction between business use and personal use for this product tax category is relevant only if you have sales in the US.",
          "name": "Downloadable software - custom - business use"
        },
        {
          "id": "txcd_10301000",
          "object": "tax_code",
          "description": "The recording of a book read aloud and sold with unlimited usage (e.g., a downloaded audio copy of The High Growth Handbook).",
          "name": "Audiobook"
        },
        {
          "id": "txcd_10302000",
          "object": "tax_code",
          "description": "​​An electronic book sold with unlimited usage.",
          "name": "e-book"
        },
        {
          "id": "txcd_10303000",
          "object": "tax_code",
          "description": "An ongoing subscription for a magazine delivered electronically and with unlimited usage.",
          "name": "Digital magazine -- subscription"
        },
        {
          "id": "txcd_10303100",
          "object": "tax_code",
          "description": "A single purchase of a magazine delivered electronically and with unlimited usage rights.",
          "name": "Digital magazine"
        },
        {
          "id": "txcd_10304000",
          "object": "tax_code",
          "description": "A single purchase of a newspaper delivered electronically and with unlimited usage.",
          "name": "Digital newspaper"
        },
        {
          "id": "txcd_10304100",
          "object": "tax_code",
          "description": "An ongoing subscription for a newspaper electronically and with unlimited usage.",
          "name": "Digital newspaper -- subscription"
        },
        {
          "id": "txcd_10401000",
          "object": "tax_code",
          "description": "A digital audio work, streamed over the internet. Access to it is limited to a fixed period of time (e.g., 24 hours).",
          "name": "Digital audio streaming -- limited use"
        },
        {
          "id": "txcd_10401100",
          "object": "tax_code",
          "description": "​​A digital audio work sold with unlimited usage rights. (e.g., a downloaded song that you now own).",
          "name": "Digital audio -- unlimited use"
        },
        {
          "id": "txcd_10401200",
          "object": "tax_code",
          "description": "A digital audio work streamed over the internet. Access to the audio work is limited to the subscription period (e.g., access to stream songs as long as a subscription is active).",
          "name": "Digital audio streaming -- subscription"
        },
        {
          "id": "txcd_10402000",
          "object": "tax_code",
          "description": "A digital audio visual work streamed over the internet that a customer can only access for a limited period of time (e.g., access to stream a movie for 24 hours).",
          "name": "Digital video streaming -- limited use"
        },
        {
          "id": "txcd_10402100",
          "object": "tax_code",
          "description": "A digital audio visual work sold with unlimited usage rights.",
          "name": "Digital video - unlimited use"
        },
        {
          "id": "txcd_10402200",
          "object": "tax_code",
          "description": "Audio visual work streamed over the internet. Access to the video programming is limited to the subscription period (e.g., access to stream video programming as long as a subscription is active).",
          "name": "Digital video streaming -- subscription"
        },
        {
          "id": "txcd_10402300",
          "object": "tax_code",
          "description": "An audio visual work of a live performance streamed over the internet that you can only access for a limited time during the performance (e.g., a live concert stream).",
          "name": "Digital video streaming -- live performance (limited use)"
        },
        {
          "id": "txcd_10501000",
          "object": "tax_code",
          "description": "A graphic or image that you access or receive electronically and have unlimited use of (e.g., a downloaded photograph).",
          "name": "Digital image"
        },
        {
          "id": "txcd_10502000",
          "object": "tax_code",
          "description": "Gift card or gift certificate that that you purchase and receive electronically and assumed to be multi-purpose.",
          "name": "Gift card"
        },
        {
          "id": "txcd_10503000",
          "object": "tax_code",
          "description": "​​A digital item that you can access or receive electronically that has unlimited usage and doesn’t fit any other digital good definition.",
          "name": "Other -- article delivered electronically"
        },
        {
          "id": "txcd_10701000",
          "object": "tax_code",
          "description": "Online advertising services such as creating and uploading advertisements on the internet. This is a standalone service that doesn’t involve the sale of tangible personal property.",
          "name": "Website advertising"
        },
        {
          "id": "txcd_10701100",
          "object": "tax_code",
          "description": "A service to enable a customer's website to be accessible on the internet.",
          "name": "Website hosting"
        },
        {
          "id": "txcd_10701200",
          "object": "tax_code",
          "description": "A service to design a website or webpage.",
          "name": "Website design"
        },
        {
          "id": "txcd_10701300",
          "object": "tax_code",
          "description": "An online service that allows a customer to create, transform, process, or access data electronically.",
          "name": "Website data processing"
        },
        {
          "id": "txcd_10701400",
          "object": "tax_code",
          "description": "An online service furnishing information to customers, including online search and data comparison.",
          "name": "Website information services"
        },
        {
          "id": "txcd_20010003",
          "object": "tax_code",
          "description": "A charge for the cleaning of tangible personal property.",
          "name": "Cleaning services"
        },
        {
          "id": "txcd_20010004",
          "object": "tax_code",
          "description": "A charge for commercial cleaning services.",
          "name": "Commercial cleaning services"
        },
        {
          "id": "txcd_20010006",
          "object": "tax_code",
          "description": "A charge for residential cleaning services.",
          "name": "Residential cleaning services"
        },
        {
          "id": "txcd_20020009",
          "object": "tax_code",
          "description": "A labor charge to install hardware where the installed property isn't considered permanently attached to the real property.",
          "name": "Installation of hardware -- nonpermanent"
        },
        {
          "id": "txcd_20020010",
          "object": "tax_code",
          "description": "A labor charge to install hardware where the installed property is permanently attached to the real property.",
          "name": "Installation of hardware -- permanent"
        },
        {
          "id": "txcd_20020018",
          "object": "tax_code",
          "description": "A charge separately stated from any sale of the product itself for the installation of tangible personal property. This a labor charge, with any non-separately stated property transferred in performing the service considered inconsequential.",
          "name": "Installation services"
        },
        {
          "id": "txcd_20030002",
          "object": "tax_code",
          "description": "Services provided by a facility for overnight care of an animal not related to veterinary care.",
          "name": "Pet boarding"
        },
        {
          "id": "txcd_20030003",
          "object": "tax_code",
          "description": "Grooming services for an animal such as haircuts, bathing, nail trimming, and flea dips.",
          "name": "Pet grooming"
        },
        {
          "id": "txcd_20040002",
          "object": "tax_code",
          "description": "A charge for personal care services (e.g., hairsalons, nailsalons, etc.).",
          "name": "Personal care services"
        },
        {
          "id": "txcd_20060000",
          "object": "tax_code",
          "description": "A charge for professional services (e.g., lawyers, dentists, engineers, physicians, etc.).",
          "name": "Professional services"
        },
        {
          "id": "txcd_20060009",
          "object": "tax_code",
          "description": "A service that allows data to be created, transformed, where the service is not performed online. Select \"Website data processing\" if the service is performed online and data is accessed by the customer electronically.",
          "name": "Tangible services -- data processing"
        },
        {
          "id": "txcd_20060022",
          "object": "tax_code",
          "description": "Planning and design of interior spaces, including preparation of layout drawings, furniture arranging, design planning and purchasing of furniture, fixtures, and cabinetry, staging, lighting and sound design.",
          "name": "Interior decorating"
        },
        {
          "id": "txcd_20060035",
          "object": "tax_code",
          "description": "Services which include, but are not limited to, editing, letter writing, proofreading, resume writing, typing or word processing. Doesn't include court reporting and stenographic services.",
          "name": "Secretarial services"
        },
        {
          "id": "txcd_20060042",
          "object": "tax_code",
          "description": "Services related to providing personnel, on a temporary basis, to perform work or labor under the supervision or control of another.",
          "name": "Temporary help services"
        },
        {
          "id": "txcd_20060044",
          "object": "tax_code",
          "description": "A charge for training sessions which provide instruction to the buyer.",
          "name": "Training services"
        },
        {
          "id": "txcd_20060045",
          "object": "tax_code",
          "description": "Live web based training. This does not include video replays of the instruction or course.",
          "name": "Training Services - Live Virtual"
        },
        {
          "id": "txcd_20060052",
          "object": "tax_code",
          "description": "Academic classes provided by traditional private education establishments and organizations.",
          "name": "Educational Services"
        },
        {
          "id": "txcd_20060058",
          "object": "tax_code",
          "description": "Self Study web based training, not instructor led. This does not include downloads of video replays.",
          "name": "Training Services - Self Study Web Based"
        },
        {
          "id": "txcd_20060059",
          "object": "tax_code",
          "description": "Personal or small group teaching, designed to help people who need extra help with their studies.",
          "name": "Tutoring"
        },
        {
          "id": "txcd_20070006",
          "object": "tax_code",
          "description": "A charge for services related to the eradication of insects, rodents, and other pests.",
          "name": "Extermination services"
        },
        {
          "id": "txcd_20070007",
          "object": "tax_code",
          "description": "A charge for services related to the maintenance of grounds.",
          "name": "Landscaping services"
        },
        {
          "id": "txcd_20070010",
          "object": "tax_code",
          "description": "A charge for services related to the painting of surfaces or the application of wallpaper.",
          "name": "Painting and wallpapering services"
        },
        {
          "id": "txcd_20080005",
          "object": "tax_code",
          "description": "A charge to repair or restore tangible personal property that was broken, worn, damaged, defective, or malfunctioning.",
          "name": "Repair services -- tangible personal property"
        },
        {
          "id": "txcd_20080007",
          "object": "tax_code",
          "description": "A charge to repair or maintain real property including repairs to HVAC, electrical, flooring, etc.",
          "name": "Repair services -- real property"
        },
        {
          "id": "txcd_20090004",
          "object": "tax_code",
          "description": "A charge for the cleaning or renovating clothing by a commercially moisture-free solvent.",
          "name": "Dry cleaning"
        },
        {
          "id": "txcd_30011000",
          "object": "tax_code",
          "description": "Apparel and footwear for people made for general use.",
          "name": "Clothing and footwear"
        },
        {
          "id": "txcd_30011100",
          "object": "tax_code",
          "description": "Formal or special occasion wear includes items such as tuxedos, cocktail dresses, and evening gowns.",
          "name": "Formal or special occasion wear"
        },
        {
          "id": "txcd_30011200",
          "object": "tax_code",
          "description": "Children's clothing and footwear including general purpose articles intended to be worn by a person based on certain size or age requirements.",
          "name": "Children's clothing and footwear"
        },
        {
          "id": "txcd_30021000",
          "object": "tax_code",
          "description": "Clothing, footwear, and accessories worn on a person's body while participating in athletic, recreational, or sporting activities, and are not adaptable to everyday use (e.g., cleated athletic shoes, fishing waders, baseball gloves).",
          "name": "Athletic and sportswear"
        },
        {
          "id": "txcd_30021200",
          "object": "tax_code",
          "description": "Bathing suits, swim trunks, or bathing costumes meant to be worn in or near water.",
          "name": "Swim suits"
        },
        {
          "id": "txcd_30031404",
          "object": "tax_code",
          "description": "Clothing, not suitable for general use, worn by an employee for protection against injury or disease or as protection against damage or injury of other persons or property.",
          "name": "Protective and safety employee clothing"
        },
        {
          "id": "txcd_30040003",
          "object": "tax_code",
          "description": "A reusable mask made of common materials, usually cotton, worn over the mouth and nose.",
          "name": "Cloth face masks"
        },
        {
          "id": "txcd_30040005",
          "object": "tax_code",
          "description": "Costume masks and accessories.",
          "name": "Costume masks and accessories"
        },
        {
          "id": "txcd_30040006",
          "object": "tax_code",
          "description": "Clothing or accessories worn by a person for special festivals or celebrations, whether cultural or seasonal, and not for everyday use.",
          "name": "Costumes"
        },
        {
          "id": "txcd_30051302",
          "object": "tax_code",
          "description": "Gloves for general use (e.g., leather), but not gloves used for sporting (e.g., baseball, football gloves).",
          "name": "Gloves (general use)"
        },
        {
          "id": "txcd_30060001",
          "object": "tax_code",
          "description": "Bags including handbags, purses, coin purses, fanny packs / bum bags, and diaper / nappy bags.",
          "name": "Bags purses and wallets"
        },
        {
          "id": "txcd_30060006",
          "object": "tax_code",
          "description": "An element of clothing such as a hat or other covering for the head.",
          "name": "Hats"
        },
        {
          "id": "txcd_30060007",
          "object": "tax_code",
          "description": "Jewlery such as necklaces, earrings, rings, and more.",
          "name": "Jewelry"
        },
        {
          "id": "txcd_30060010",
          "object": "tax_code",
          "description": "Articles other than clothing, footwear, and clothing accessories, designed to be worn on or about the human body for ornamentation (e.g., handkerchiefs, belt buckles, umbrellas, cufflinks, tie clasps, tie tacks, money clips, etc.).",
          "name": "Non-clothing accessories"
        },
        {
          "id": "txcd_30060016",
          "object": "tax_code",
          "description": "A small timepiece worn typically on a strap on one's wrist.",
          "name": "Watches"
        },
        {
          "id": "txcd_30071000",
          "object": "tax_code",
          "description": "Protective or foot gear worn about the human body while participating in athletic, recreational, or sporting activities, but which are not incidental or adaptable to, everyday use (e.g., bike helmets, baseball gloves, goggles, ski boots, swim fins, life jackets, etc.).",
          "name": "Sporting activities equipment"
        },
        {
          "id": "txcd_31030001",
          "object": "tax_code",
          "description": "Scented talcum powder or corn starch for use on babies' skin or an ointment or paste for protecting baby's skin.",
          "name": "Baby powder and diaper cream"
        },
        {
          "id": "txcd_31030003",
          "object": "tax_code",
          "description": "Non medicated disposable moistened cleansing wipes. These products do not contain a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Baby wipes"
        },
        {
          "id": "txcd_31031202",
          "object": "tax_code",
          "description": "Disposable diapers for infants.",
          "name": "Infant diapers"
        },
        {
          "id": "txcd_31040001",
          "object": "tax_code",
          "description": "A bottle with a teat or nipple in the US made for babies to drink from.",
          "name": "Baby bottles and nipples"
        },
        {
          "id": "txcd_31040002",
          "object": "tax_code",
          "description": "A mechanical device that lactating women use to extract milk from their breasts.",
          "name": "Breast pumps"
        },
        {
          "id": "txcd_31070001",
          "object": "tax_code",
          "description": "Baby or child car seat, including boosters.",
          "name": "Baby or child car seat"
        },
        {
          "id": "txcd_32010001",
          "object": "tax_code",
          "description": "Electronic devices which measure the glucose level in human blood (e.g., blood sugar meters, glucose meters or glucometers).",
          "name": "Blood glucose monitoring devices"
        },
        {
          "id": "txcd_32010002",
          "object": "tax_code",
          "description": "Equipment, devices or chemical reagents which may be used by a diabetic to test or monitor blood or urine.",
          "name": "Diabetic testing equipment and supplies"
        },
        {
          "id": "txcd_32020002",
          "object": "tax_code",
          "description": "A compound, substance or preparation intended for use in the diagnosis, cure, mitigation, treatment, or prevention of disease and dispensed legally without a prescription.",
          "name": "Drugs - over the counter"
        },
        {
          "id": "txcd_32030001",
          "object": "tax_code",
          "description": "Male or female condoms used to prevent pregnacy or exposure to sexually transmitted diseases.",
          "name": "Condoms"
        },
        {
          "id": "txcd_32040005",
          "object": "tax_code",
          "description": "Feminine hygiene product designed to absorb the menstrual flow.",
          "name": "Tampons, pads, and sanitary napkins"
        },
        {
          "id": "txcd_32050001",
          "object": "tax_code",
          "description": "Adult disposable diapers.",
          "name": "Adult disposable diapers"
        },
        {
          "id": "txcd_32050005",
          "object": "tax_code",
          "description": "A mask worn on an individual's face that is not intended for repeated use and is typically discarded after each use.",
          "name": "Disposable face masks"
        },
        {
          "id": "txcd_32050006",
          "object": "tax_code",
          "description": "Soaps, cleaning solutions, shampoo, toothpaste, mouthwash, antiperspirants, suntan lotions, etc.",
          "name": "Grooming and hygiene products"
        },
        {
          "id": "txcd_32050007",
          "object": "tax_code",
          "description": "Soaps, cleaning solutions, shampoo, toothpaste, mouthwash, antiperspirants, suntan lotions, and sunscreens that contain medicinal ingredients as described on the product's label.",
          "name": "Grooming and hygiene products - medicated"
        },
        {
          "id": "txcd_32050009",
          "object": "tax_code",
          "description": "A liquid, gel, foam, or wipe generally used to decrease infectious agents on the hands that contain a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Hand sanitizers"
        },
        {
          "id": "txcd_32050012",
          "object": "tax_code",
          "description": "Topical medicated solutions for treating skin acne that contain a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Medicated acne treatments"
        },
        {
          "id": "txcd_32050013",
          "object": "tax_code",
          "description": "Lotions, moisturizers, creams, powders, sprays, etc that promote optimal skin health that do not contain a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Skin care products"
        },
        {
          "id": "txcd_32050014",
          "object": "tax_code",
          "description": "Lotions, moisturizers, creams, powders, sprays, etc that promote optimal skin health and contain a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Skin care products -- medicated"
        },
        {
          "id": "txcd_32050015",
          "object": "tax_code",
          "description": "Over-the-counter nicotine replacement products, including patches, gum, lozenges, sprays and inhalers that contain a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Smoking cessation products"
        },
        {
          "id": "txcd_32050017",
          "object": "tax_code",
          "description": "Toilet tissue or paper primarily used for the removal of feces.",
          "name": "Toilet tissue"
        },
        {
          "id": "txcd_32050018",
          "object": "tax_code",
          "description": "A small brush with a long handle, used for cleaning the teeth.",
          "name": "Toothbrush"
        },
        {
          "id": "txcd_32050019",
          "object": "tax_code",
          "description": "A thick, soft, moist substance used on a brush for cleaning one's teeth.",
          "name": "Toothpaste"
        },
        {
          "id": "txcd_32060001",
          "object": "tax_code",
          "description": "Equipment primarily and customarily used to serve a medical purpose and generally is not useful to a person in the absence of illness or injury and is not worn in or on the body (e.g., hospital beds, commode chairs, bed pans, IV poles, etc.).",
          "name": "Durable medical equipment"
        },
        {
          "id": "txcd_32070003",
          "object": "tax_code",
          "description": "Item that is applied directly to or inside a wound to absorb wound drainage, protect healing tissue, maintain a moist or dry wound environment (as appropriate), or prevent bacterial contamination.",
          "name": "Wound care supplies -- bandages, dressings, gauze"
        },
        {
          "id": "txcd_32070004",
          "object": "tax_code",
          "description": "An item that to treat a wound applied directly. These supplies contain medication such as an antibiotic ointment and are a labeled with a \"drug facts\" panel or a statement of active ingredients.",
          "name": "Wound care supplies -- bandages, dressings, gauze (medicated)"
        },
        {
          "id": "txcd_32070018",
          "object": "tax_code",
          "description": "A collection of mixed supplies and equipment that is used to give medical treatment. Exempt or low rated qualifying medicinal items (e.g., over the counter drugs) make up 51% or more of the value of the kit.",
          "name": "First aid kits"
        },
        {
          "id": "txcd_32070019",
          "object": "tax_code",
          "description": "Single use disposable gloves (latex, nitrile, vinyl, etc) that while appropriate for multiple uses, have an application in a first aid or medical setting.",
          "name": "Gloves - non-surgical (disposable)"
        },
        {
          "id": "txcd_32070028",
          "object": "tax_code",
          "description": "Items for use in cure, treatment or diagnosis of injury, illness, disease or incapacity, and which is consumed during the use.",
          "name": "Medical supplies - consumable"
        },
        {
          "id": "txcd_32080001",
          "object": "tax_code",
          "description": "Aids that can increase, improve, or assist mobility in the bathroom such as raised toilet seat, tub & shower stool, hand rails, grab bars, etc.",
          "name": "Bath aids"
        },
        {
          "id": "txcd_32080003",
          "object": "tax_code",
          "description": "Equipment which is primarily and customarily used to provide or increase the ability to move from one place to another and is not generally used by persons with normal mobility (e.g., crutches, walkers, and wheelchairs).",
          "name": "Mobility enhancing equipment"
        },
        {
          "id": "txcd_32080004",
          "object": "tax_code",
          "description": "Parts for items such as crutch pads, walker tips, cane tips, crutch tips, etc.",
          "name": "Repair & replacement parts for mobility enhancing equipment"
        },
        {
          "id": "txcd_32090003",
          "object": "tax_code",
          "description": "Corrective lenses, including eyeglasses and contact lenses, sold without a prescription order of a licensed professional.",
          "name": "Corrective lenses"
        },
        {
          "id": "txcd_32090005",
          "object": "tax_code",
          "description": "Batteries specifically labeled and designed to operate hearing aid devices, sold without a prescription order of a licensed professional.",
          "name": "Hearing aid batteries"
        },
        {
          "id": "txcd_32090006",
          "object": "tax_code",
          "description": "Artificial devices to correct or alleviate hearing deficiencies, sold without a prescription order of a licensed professional.",
          "name": "Hearing aids"
        },
        {
          "id": "txcd_32090007",
          "object": "tax_code",
          "description": "A replacement, corrective, or supportive device, worn on or in the body to artificially replace a missing portion of the body, prevent or correct physical deformity, etc. sold without prescription order of a licensed professional.",
          "name": "Prosthetic device"
        },
        {
          "id": "txcd_32100006",
          "object": "tax_code",
          "description": "One-time use medical thermometers for oral, temporal and forehead, or rectal body temperature diagnostics.",
          "name": "Medical thermometers -- disposable"
        },
        {
          "id": "txcd_32100007",
          "object": "tax_code",
          "description": "Multiple use medical thermometers for oral, temporal and forehead, or rectal body temperature diagnostics.",
          "name": "Medical thermometers -- reusable"
        },
        {
          "id": "txcd_32100008",
          "object": "tax_code",
          "description": "Products carrying an ENERGY STAR rating (e.g., light bulbs, appliances, etc.).",
          "name": "ENERGY STAR products"
        },
        {
          "id": "txcd_33020001",
          "object": "tax_code",
          "description": "Ceiling Fans carrying an Energy Star rating.",
          "name": "Ceiling fans - Energy Star"
        },
        {
          "id": "txcd_33020002",
          "object": "tax_code",
          "description": "Domestic air conditioning (central or room) systems carrying Energy Star rating.",
          "name": "Air conditioners - Energy Star"
        },
        {
          "id": "txcd_33020003",
          "object": "tax_code",
          "description": "Domestic gas or oil furnaces carrying an Energy Star rating.",
          "name": "Furnaces - Energy Star"
        },
        {
          "id": "txcd_33020004",
          "object": "tax_code",
          "description": "Domestic air source heat pumps carrying Energy Star rating.",
          "name": "Heat Pumps - Energy Star"
        },
        {
          "id": "txcd_33020005",
          "object": "tax_code",
          "description": "Domestic water heater carrying Energy Star rating.",
          "name": "Water heater - Energy Star"
        },
        {
          "id": "txcd_33020006",
          "object": "tax_code",
          "description": "Domestic appliance carrying an Energy Star Rating which reduces and maintains the level of humidity in the air.",
          "name": "Dehumidifier - Energy Star"
        },
        {
          "id": "txcd_33020007",
          "object": "tax_code",
          "description": "Domestic gas or oil boilers for space or water heating carrying an Energy Star rating.",
          "name": "Boilers - Energy Star"
        },
        {
          "id": "txcd_33020008",
          "object": "tax_code",
          "description": "An in home programmable thermostat, such as a WiFi enabled smart thermostat, carrying an Energy Star rating.",
          "name": "Programmable Wall Thermostat - Energy Star"
        },
        {
          "id": "txcd_33020009",
          "object": "tax_code",
          "description": "Domestic standard size refrigerators carrying Energy Star rating.",
          "name": "Refrigerators - Energy Star"
        },
        {
          "id": "txcd_33020010",
          "object": "tax_code",
          "description": "Domestic dish washing appliances carrying Energy Star rating.",
          "name": "Dishwashers - Energy Star"
        },
        {
          "id": "txcd_33020011",
          "object": "tax_code",
          "description": "Domestic freezers carrying Energy Star rating.",
          "name": "Freezers- Energy Star"
        },
        {
          "id": "txcd_33020012",
          "object": "tax_code",
          "description": "Domestic clothes washing appliances carrying Energy Star rating.",
          "name": "Clothes Washing Machine - Energy Star"
        },
        {
          "id": "txcd_33020013",
          "object": "tax_code",
          "description": "Domestic clothes drying appliances carrying Energy Star rating.",
          "name": "Clothes drying machine - Energy Star"
        },
        {
          "id": "txcd_33020014",
          "object": "tax_code",
          "description": "Non-electric can opener.",
          "name": "Can opener - manual"
        },
        {
          "id": "txcd_33020200",
          "object": "tax_code",
          "description": "Products used for conservation or efficient use of water to be environmental friendly.",
          "name": "Water efficiency products"
        },
        {
          "id": "txcd_33030001",
          "object": "tax_code",
          "description": "Single or multi-pack AA, AAA, c, D, 6-volt or 9-volt batteries, excluding automobile or boat batteries.",
          "name": "Alkaline Batteries"
        },
        {
          "id": "txcd_33031001",
          "object": "tax_code",
          "description": "Mobile phone batteries.",
          "name": "Mobile Phone Batteries"
        },
        {
          "id": "txcd_33080201",
          "object": "tax_code",
          "description": "Wipes used in the process of eliminating or reducing harmful microorganisms from inanimate objects and surfaces.",
          "name": "Disinfectant wipes"
        },
        {
          "id": "txcd_33080202",
          "object": "tax_code",
          "description": "Disposable household paper products such as paper towels, napkins, tissues, plates, cups, bags, etc.",
          "name": "Disposable household paper products"
        },
        {
          "id": "txcd_33080300",
          "object": "tax_code",
          "description": "Includes blankets, pillows, bed linens/sheets, comforters, towels, wash cloths, shower curtains and bath mats.",
          "name": "Household linens, bedding, towels, and shower curtains"
        },
        {
          "id": "txcd_33100001",
          "object": "tax_code",
          "description": "Landscape soil, mulch, compost - residential.",
          "name": "Landscape Soil/ Mulch/ Compost - Residential"
        },
        {
          "id": "txcd_33100101",
          "object": "tax_code",
          "description": "Chemicals for use in non-commercial gardens to produce foods for human consumption.",
          "name": "Insecticides, herbicides, fungicides"
        },
        {
          "id": "txcd_33100200",
          "object": "tax_code",
          "description": "Any substance such as manure or a mixture of nitrates used to make soil more fertile.",
          "name": "Plant food"
        },
        {
          "id": "txcd_33110001",
          "object": "tax_code",
          "description": "Standard incandescent light bulbs carrying an Energy Star rating.",
          "name": "Incandescent Light Bulbs - Energy Star"
        },
        {
          "id": "txcd_33110002",
          "object": "tax_code",
          "description": "Compact Fluorescent light (CFL) bulbs carrying an Energy Star rating.",
          "name": "Compact Fluorescent Light Bulbs - Energy Star"
        },
        {
          "id": "txcd_33110003",
          "object": "tax_code",
          "description": "Light emitting diode (LED) bulbs carrying an Energy Star rating.",
          "name": "LED Bulbs - Energy Star"
        },
        {
          "id": "txcd_33110004",
          "object": "tax_code",
          "description": "Portable self-powered or battery powered light sources, including flashlights, lanterns, emergency glow sticks or light sticks.",
          "name": "Portable Light Sources"
        },
        {
          "id": "txcd_33110005",
          "object": "tax_code",
          "description": "Candles to be used a light source.",
          "name": "Candles"
        },
        {
          "id": "txcd_33120000",
          "object": "tax_code",
          "description": "Qualifying items for purposes of certain sales tax holidays such as cell phone batteries, cell phone chargers, and two-way radios.",
          "name": "Storm preparedness items"
        },
        {
          "id": "txcd_33120001",
          "object": "tax_code",
          "description": "Portable self-powered or battery powered radio, two-way radio, weatherband radio.",
          "name": "Portable Radios"
        },
        {
          "id": "txcd_33120002",
          "object": "tax_code",
          "description": "Non-electric food or beverage cooler.",
          "name": "Food Storage Cooler"
        },
        {
          "id": "txcd_33120003",
          "object": "tax_code",
          "description": "Smoke Detectors.",
          "name": "Smoke Detectors"
        },
        {
          "id": "txcd_33120004",
          "object": "tax_code",
          "description": "Carbon Monoxide Detectors.",
          "name": "Carbon Monoxide Detectors"
        },
        {
          "id": "txcd_33120005",
          "object": "tax_code",
          "description": "Fire Extinguishers.",
          "name": "Fire Extinguishers"
        },
        {
          "id": "txcd_33120006",
          "object": "tax_code",
          "description": "Portable fuel container.",
          "name": "Portable Fuel Container"
        },
        {
          "id": "txcd_33120007",
          "object": "tax_code",
          "description": "Non-electric water container to store water for emergency usage.",
          "name": "Water storage container"
        },
        {
          "id": "txcd_33120008",
          "object": "tax_code",
          "description": "Artificial ice, blue ice, ice packs, reusable ice.",
          "name": "Artificial Ice"
        },
        {
          "id": "txcd_33120009",
          "object": "tax_code",
          "description": "Tarps, plastic sheeting, plastic drop cloths, waterproof sheeting.",
          "name": "Tarpaulins and Weatherproof Sheeting"
        },
        {
          "id": "txcd_33120010",
          "object": "tax_code",
          "description": "Portable generator used to provide light or communications or power appliances during a power outage.",
          "name": "Portable Generator"
        },
        {
          "id": "txcd_33120011",
          "object": "tax_code",
          "description": "Power cords used to connect electrical equipment and devices to power sockets.",
          "name": "Power cords"
        },
        {
          "id": "txcd_33120012",
          "object": "tax_code",
          "description": "An hand held tool with a bladed head on a handle used for hewing, cleaving, chopping, etc.",
          "name": "Axes/Hatchets"
        },
        {
          "id": "txcd_33120013",
          "object": "tax_code",
          "description": "Gas-powered chainsaw.",
          "name": "Garden chainsaw"
        },
        {
          "id": "txcd_33120014",
          "object": "tax_code",
          "description": "Chainsaw accessories include chains, lubricants, motor oil, chain sharpeners, bars, wrenches, carrying cases, repair parts, safety apparel.",
          "name": "Chainsaw accessories"
        },
        {
          "id": "txcd_33120015",
          "object": "tax_code",
          "description": "Plywood, window film, storm shutters, hurricane shutters or other materials specifically designed to protect windows.",
          "name": "Storm shutters/window protection devices"
        },
        {
          "id": "txcd_33120016",
          "object": "tax_code",
          "description": "Ladder used for home emergency evacuation.",
          "name": "Emergency/rescue ladder"
        },
        {
          "id": "txcd_33120017",
          "object": "tax_code",
          "description": "Ropes and Cords and similar fastening products.",
          "name": "Ropes and Cords"
        },
        {
          "id": "txcd_33120018",
          "object": "tax_code",
          "description": "Ground anchor systems and tie down kits for securing property against severe weather.",
          "name": "Ground Anchor Systems and Tie-down Kits"
        },
        {
          "id": "txcd_33120019",
          "object": "tax_code",
          "description": "Duct Tape.",
          "name": "Duct Tape"
        },
        {
          "id": "txcd_33150001",
          "object": "tax_code",
          "description": "WaterSense labeled toilets.",
          "name": "Toilets - WaterSense"
        },
        {
          "id": "txcd_33150002",
          "object": "tax_code",
          "description": "WaterSense labeled urinals.",
          "name": "Urinals - WaterSense"
        },
        {
          "id": "txcd_33150003",
          "object": "tax_code",
          "description": "WaterSense labeled bathroom sink faucets and accessories.",
          "name": "Bathroom Faucets - WaterSense"
        },
        {
          "id": "txcd_33150004",
          "object": "tax_code",
          "description": "WaterSense labeled sprinkler body is the exterior shell that connects to the irrigation system piping and houses the spray nozzle that applies water on the landscape.",
          "name": "Spray Water Sprinkler Bodies - WaterSense"
        },
        {
          "id": "txcd_33150005",
          "object": "tax_code",
          "description": "WaterSense labeled irrigation controllers, which act like a thermostat for your sprinkler system telling it when to turn on and off, use local weather and landscape conditions to tailor watering schedules to actual conditions on the site.",
          "name": "Irrigation Controls - WaterSense"
        },
        {
          "id": "txcd_33150006",
          "object": "tax_code",
          "description": "WaterSense labeled showerheads.",
          "name": "Showerheads - WaterSense"
        },
        {
          "id": "txcd_34020005",
          "object": "tax_code",
          "description": "Consumer electronics peripherals and accessories (e.g., bluetooth headsets).",
          "name": "Consumer electronics peripherals & accessories"
        },
        {
          "id": "txcd_34020027",
          "object": "tax_code",
          "description": "Electronic devices such as televisions, or smartphones, bought for personal rather than commercial use. Excludes personal computers, including laptops, tablets and desktops which are covered by 37010000.",
          "name": "Consumer electronics"
        },
        {
          "id": "txcd_35010000",
          "object": "tax_code",
          "description": "Books or booklets consisting of text or illustrations bound in a stiffer cover than the pages.",
          "name": "Books"
        },
        {
          "id": "txcd_35010001",
          "object": "tax_code",
          "description": "Children's books including picture books, painting, drawing, and activity books.",
          "name": "Books for children"
        },
        {
          "id": "txcd_35010400",
          "object": "tax_code",
          "description": "Printed religious books and manuals.",
          "name": "Religious books"
        },
        {
          "id": "txcd_35010500",
          "object": "tax_code",
          "description": "Recognized in the ordinary and usual sense as a \"book\", except that the product is audio and delivered electronically or on a CD/DVD instead of in a printed format.",
          "name": "Audiobook (Physical Copy)"
        },
        {
          "id": "txcd_35020100",
          "object": "tax_code",
          "description": "Publications distributed to the public at regular intervals that contains news of general interest.",
          "name": "Newspapers"
        },
        {
          "id": "txcd_35020200",
          "object": "tax_code",
          "description": "Publications, including magazines, distributed on a periodic basis.",
          "name": "Magazines"
        },
        {
          "id": "txcd_36010001",
          "object": "tax_code",
          "description": "Flea and tick products for animal use including soaps, cleaning solutions, and shampoos (e.g., flea collars, flea powder, tick and flea soap, and tick sprays).",
          "name": "Flea and tick products"
        },
        {
          "id": "txcd_36010002",
          "object": "tax_code",
          "description": "Drugs or substance for treating animals and intended for use in the diagnosis, cure, mitigation, treatment, or prevention of disease.",
          "name": "Over-the-counter drugs for animal use - without a prescription"
        },
        {
          "id": "txcd_36010003",
          "object": "tax_code",
          "description": "Medical supplies available without a prescription and used in the treatment of companion animals (e.g., first aid items such as bandages and gauze).",
          "name": "Over-the-counter medical supplies for pets"
        },
        {
          "id": "txcd_36010004",
          "object": "tax_code",
          "description": "Food for household pets that is consumed for nutritional value. This code is not intended for food related to working farm animals or animals raised for meat or milk production.",
          "name": "Pet food"
        },
        {
          "id": "txcd_36010005",
          "object": "tax_code",
          "description": "Pet food products offering additional nutrients or functional ingredients.",
          "name": "Pet vitamins"
        },
        {
          "id": "txcd_37010000",
          "object": "tax_code",
          "description": "Personal computers, including laptops, tablets, desktops.",
          "name": "Personal computers, including laptops, tablets, desktops"
        },
        {
          "id": "txcd_37050001",
          "object": "tax_code",
          "description": "Books that are required or approved for use in conjunction with a curriculum provided by an educational institution.",
          "name": "School textbooks"
        },
        {
          "id": "txcd_37060001",
          "object": "tax_code",
          "description": "Bags designed to carry students' books during the school day. This category does not include backpags for traveling, hiking, camping, etc.",
          "name": "Bookbags and backpacks"
        },
        {
          "id": "txcd_37060012",
          "object": "tax_code",
          "description": "An item commonly used by a student in a course of study (e.g., binders, composition books, crayons, index cards, pencils, pens, notebooks, scissors, etc.).",
          "name": "School supplies"
        },
        {
          "id": "txcd_37070001",
          "object": "tax_code",
          "description": "Software prewritten and delivered on tangible media.",
          "name": "Tangible media -- prewritten software"
        },
        {
          "id": "txcd_40040000",
          "object": "tax_code",
          "description": "Food and food ingredients for home consumption.",
          "name": "Food"
        },
        {
          "id": "txcd_40040004",
          "object": "tax_code",
          "description": "Foods and formulas meant for feeding babies and infants.",
          "name": "Baby food"
        },
        {
          "id": "txcd_40050004",
          "object": "tax_code",
          "description": "Food bundle or basket containing food staples combined with tangible personal property, with the food comprising between 50% and 90% of the overall value of the bundle.",
          "name": "Tangible personal property bundle -- 50-90% food"
        },
        {
          "id": "txcd_40050005",
          "object": "tax_code",
          "description": "Food bundle or basket containing food staples combined with tangible personal property, with the food comprising less 90% or more of the overall value of the bundle.",
          "name": "Tangible personal property bundle -- 90% food or more"
        },
        {
          "id": "txcd_40050006",
          "object": "tax_code",
          "description": "Food bundle or basket containing food staples combined with tangible personal property, with the food comprising less than 50% of the overall value of the bundle.",
          "name": "Tangible personal property bundle -- less than 50% food"
        },
        {
          "id": "txcd_40060003",
          "object": "tax_code",
          "description": "Ready to eat foods intended to be consumed on site by people.",
          "name": "Prepared foods"
        },
        {
          "id": "txcd_40070005",
          "object": "tax_code",
          "description": "Snack foods including chips, crisps, puffs, curls or sticks, popped corn, brittle pretzels, salted nuts and salted seeds, granola products and snack mixes. This category does not include items such as crackers, cookies, snack cakes or breakfast cereal.",
          "name": "Snack foods"
        },
        {
          "id": "txcd_40090001",
          "object": "tax_code",
          "description": "Tablet, capsule, powder, softgel, gelcap, or liquid intended that contain a vitamin, mineral, herb, other botanical, or amino acid and is labeled as a dietary supplement identifiable by the \"supplement facts\" box found on the label.",
          "name": "Dietary supplements"
        }
    ]
};

