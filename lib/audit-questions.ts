export const auditQuestions = [
  {
    category: "Satisfaction client",
    questions: [
      { text: "Propreté des locaux", type: "rating" },
      { text: "Mise en avant et organisation des produits", type: "rating" },
      { text: "État du mobilier", type: "rating" },
      { text: "Apparence et présentation du personnel", type: "rating" },
    ],
  },
  {
    category: "Prix compétitifs",
    questions: [
      { text: "Clarté de l’affichage des prix et noms des produits", type: "rating" },
      { text: "Disponibilité des offres « Meilleur prix »", type: "yesno" },
    ],
  },
  {
    category: "Gestion du point de vente",
    questions: [
      { text: "Respect des normes de la surface commerciale", type: "rating" },
      { text: "Stock et matériel correctement rangés", type: "yesno" },
      { text: "Effectif du personnel adapté à l’affluence", type: "yesno" },
    ],
  },
]

export const ratingEmojis = {
  1: { emoji: "😞", lightColor: "#ffcccc", darkColor: "#ff0000" },
  2: { emoji: "😐", lightColor: "#ffebcc", darkColor: "#ff9900" },
  3: { emoji: "🙂", lightColor: "#ccffcc", darkColor: "#00cc00" },
  4: { emoji: "😃", lightColor: "#cce6cc", darkColor: "#009900" },
}
