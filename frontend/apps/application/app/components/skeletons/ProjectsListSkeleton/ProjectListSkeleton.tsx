import ProjectCardSkeleton from "./ProjectCardSkeleton";

export default function DisplayProjectsListSkeleton() {
  return (
    <div>
      <ul className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4 py-6">
        {[...Array(6)].map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </ul>
    </div>
  )
}