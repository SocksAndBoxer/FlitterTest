import { useState } from 'react'
import './App.css'
import { useMutation } from '@tanstack/react-query'
import { TCarInfo } from './types'
import { SearchcarByImmat } from './components/SearchCarByImmat'
import { FinitionsList } from './components/FinitionsList'

export type TFinition = { value: string; label: string }

const App = () => {
  const [finitions, setFinitions] = useState<TFinition[]>([])
  const [immat, setImmat] = useState('')
  const [noCarFound, setNoCarFound] = useState(false)
  const [errorImmat, setErrorImmat] = useState('')

  const {
    isPending,
    data,
    mutate: fetchCarByImmat,
  } = useMutation({
    mutationFn: async (immat: string): Promise<TCarInfo> => {
      const res = await fetch(
        `https://api-dev.flitter.fr/v1/underwriting/car/finitions_theoriques_by_license_plate?license_plate=${immat}`
      )
      return res.json()
    },
    onError: err => {
      setErrorImmat('Une erreur est survenue')
      setNoCarFound(true)
      console.log(err)
    },
    onSuccess: data => {
      setNoCarFound(false)

      if (data.finitions.version.length === 0) {
        setErrorImmat('Aucune version trouvée')
      }

      if (!data || !data.modele) {
        setErrorImmat('Aucune version trouvée')
      }

      const finitions =
        data.finitions.version.map(
          (version: string): TFinition => ({
            value: version,
            label: version.toUpperCase(),
          })
        ) || []
      setFinitions(finitions)
    },
  })

  /**
   * search immat
   */
  const onSubmit = (e: any) => {
    e.preventDefault()

    let regCharacters = /^[a-zA-Z0-9-\-\s]*$/

    setErrorImmat('')
    if (regCharacters.test(immat) === false) {
      setErrorImmat("Le numéro de la plaque d'immatriculation n'est pas valide")
      return
    }

    fetchCarByImmat(immat.split(' ').join('').split('-').join(''))
  }

  if ((!data || !data.modele) && !isPending) {
    const finitions =
      data?.finitions?.version?.map(
        (version: string): TFinition => ({
          value: version,
          label: version.toUpperCase(),
        })
      ) || []
  }

  if (isPending) return <></>

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <div className='mb-4'>
          <div className='inline-flex items-center px-3 py-1 bg-blue-100 rounded-md'>
            <span className='text-sm font-semibold text-blue-700'>
              Plaque d'immatriculation
            </span>
          </div>
        </div>
        <SearchcarByImmat
          errorImmat={errorImmat}
          immat={immat}
          noCarFound={noCarFound}
          onSubmit={onSubmit}
          setImmat={setImmat}
        />
        {finitions.length > 0 && <FinitionsList finitions={finitions} />}
      </div>
    </div>
  )
}

export default App
