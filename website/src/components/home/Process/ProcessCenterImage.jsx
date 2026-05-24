import processImg from '../../../assets/imgs/home/Process.png'

export function ProcessCenterImage({ className = '' }) {
  return (
    <div className={['group flex shrink-0 justify-center', className].filter(Boolean).join(' ')}>
      <img
        src={processImg}
        alt=""
        className="h-44 w-44 rounded-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] sm:h-52 sm:w-52 lg:h-66 lg:w-66"
      />
    </div>
  )
}
