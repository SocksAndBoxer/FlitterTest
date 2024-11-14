import { TCarInfo } from '../types'

type CardModelInfosProps = {
  details: Omit<TCarInfo, 'finitions'>
}
export const CarModelInfos = ({ details }: CardModelInfosProps) => {
  return (
    <section>
      <h3 className='text-lg font-semibold text-gray-700'>Détails:</h3>
      <ul>
        <li>Carrosserie: {details.carrosserie}</li>
        <li>Genre: {details.genre_v}</li>
        <li>Hauteur: {details.hauteur}</li>
        <li>Longueur: {details.longueur}</li>
        <li>Marque: {details.marque}</li>
        <li>Prix: {details.prix_vehic}€</li>
        <li>Modèle: {details.modele}</li>
      </ul>
    </section>
  )
}
