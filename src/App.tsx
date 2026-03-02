import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { useTitle } from '@/hooks/useTitle'

function App() {
    useTitle('Home')

    return (
        <MainLayout>
            <HomePage />
        </MainLayout>
    )
}

export default App
