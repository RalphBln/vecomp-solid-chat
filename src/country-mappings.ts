export const countryMappings: { [key: string]: CountryMapping } = {
    Germany: {
        origin: "German",
        age_of_majority: 18,
        hate_speech_title: "Dein Beitrag enthält offenbar Hassrede.",
        community_guidelines_violation: "Dein Beitrag verstößt gegen unsere Community-Richtlinien.",
        national_law_violation: "Der Inhalt Deines Beitrags verstößt gegen das Gesetz."
    },
    Greece: {
        origin: "Greek",
        age_of_majority: 18,
        hate_speech_title: "Η ανάρτησή σας φαίνεται να περιέχει ρητορική μίσους.",
        community_guidelines_violation: "Η ανάρτησή σας παραβιάζει τις οδηγίες της κοινότητάς μας.",
        national_law_violation: "Το περιεχόμενο της ανάρτησής σας παραβιάζει την εθνική νομοθεσία."
    },
    France: {
        origin: "French",
        age_of_majority: 18,
        hate_speech_title: "Le contenu de votre message semble contenir des propos haineux.",
        community_guidelines_violation: "Votre message ne respecte pas notre règlement de la communauté.",
        national_law_violation: "Le contenu de ton message est contraire au droit national."
    },
    USA : {
        origin: "American",
        age_of_majority: 18,
        hate_speech_title: "Your post appears to contain hate speech.",
        community_guidelines_violation: "Your post violates our community guidelines.",
        national_law_violation: "The content of your post violates national law."
    }
}

type CountryMapping = {
    origin: string,
    age_of_majority: number,
    hate_speech_title: string,
    community_guidelines_violation: string,
    national_law_violation: string
}