import { TFinition } from '../App'

type FinitionsListProp = {
  finitions: TFinition[]
}

export const FinitionsList = ({ finitions }: FinitionsListProp) => {
  return (
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
  )
}
