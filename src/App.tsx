import { useState } from 'react'
import './App.css'
import { useMutation } from '@tanstack/react-query'

type TFinition = { value: string; label: string }

type TCarInfo = {
  modele: string
  finitions: { version: string[] }
}

const App = () => {
  const [finitions, setFinitions] = useState<TFinition[]>([])
  const [immat, setImmat] = useState('')
  const [noCarFound, setNoCarFound] = useState(false)
  const [errorImmat, setErrorImmat] = useState('')

  const {
    isPending,
    isError,
    isSuccess,
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
      console.log(err)
    },
    onSuccess: data => {
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
    console.log('test')

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
        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <input
              name='immat'
              value={immat}
              onChange={e => setImmat(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder="Entrez votre plaque d'immatriculation"
            />
          </div>
          {noCarFound && (
            <p className='text-red-500 text-sm'>
              Nous n'avons pas trouvé votre véhicule
            </p>
          )}
          {errorImmat && <p className='text-red-500 text-sm'>{errorImmat}</p>}
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'
          >
            Rechercher
          </button>
        </form>
        {finitions.length > 0 && (
          <div className='mt-6 space-y-2'>
            <h3 className='text-lg font-semibold text-gray-700'>Finitions:</h3>
            {finitions.map(option => (
              <div
                key={option.value}
                className='p-2 bg-gray-50 rounded-md text-gray-700'
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
