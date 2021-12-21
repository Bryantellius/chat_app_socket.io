import React from 'react'
import { authRoles } from '../../auth/authRoles'

const dashboardRoutes = [
    {
        path: '/dashboard',
        component: React.lazy(() => import('./LiveScoreboard')),
        auth: authRoles.sa,
    }
]

export default dashboardRoutes
