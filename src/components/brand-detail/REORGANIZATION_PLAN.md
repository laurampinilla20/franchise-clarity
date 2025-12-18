# Plan de Reorganización de BrandDetail

## Estructura Actual vs Deseada

### Estructura Actual (Problemática)
- Todo en un solo archivo (2156 líneas)
- Uso de `contents` que causa problemas de ordenamiento
- Elementos de columna 2 no duplicados en columna 1
- Contenido logged-in mezclado con contenido público

### Estructura Deseada

#### COLUMN 1 (Left - 70% lg, 50% xl)
1. Franchise Review Card (Snapshot)
2. Snapshot Section
3. Investment Section
4. Profitability Section
5. Comparison Section
6. Territories Section
7. Requirements Section
8. Next Steps Section
9. FAQs Section

**Elementos duplicados de Columna 2 (ocultos en desktop, visibles en mobile):**
- Talk to Advisor Card (Top) - `lg:hidden` en Col1, visible en Col2
- Why buyers like - `lg:hidden` en Col1, visible en Col2
- Similar Brands - `lg:hidden` en Col1, visible en Col2
- Ongoing Fees - `lg:hidden` en Col1, visible en Col2
- Not sure you can afford - `lg:hidden` en Col1, visible en Col2
- Unlock full profitability - `lg:hidden` en Col1, visible en Col2
- Talk to Advisor Card (Bottom) - `lg:hidden` en Col1, visible en Col2

#### COLUMN 2 (Right - 30% lg, 50% xl)
1. Talk to Advisor Card (Top)
2. Why buyers like this brand
3. Similar Brands
4. Ongoing Fees & Recurring Costs
5. Not sure you can afford this franchise?
6. Unlock full profitability analysis
7. Talk to Advisor Card (Bottom - Sticky)

**Visibilidad:**
- Todos visibles en desktop (`lg:block`)
- Todos ocultos en mobile (`lg:hidden` en Col2, visibles en Col1)

## Módulos Logged-In

Cada sección tendrá un módulo adicional que se muestra cuando `isLoggedIn === true`:

1. **InvestmentLoggedIn** - Investment Summary Table + 4 info cards
2. **ProfitabilityLoggedIn** - Net Franchisee Growth + Financial Transparency
3. **ComparisonLoggedIn** - Detailed charts + Turnover section
4. **TerritoriesLoggedIn** - Available + Sold Out territories
5. **RequirementsLoggedIn** - Ideal Profile + Requirements cards
6. **NextStepsLoggedIn** - 11-step timeline
7. **FAQsLoggedIn** - 10 detailed FAQ items

## Implementación

### Paso 1: Reorganizar estructura principal
- Asegurar que Column 1 y Column 2 estén claramente separadas
- Duplicar elementos de Col2 en Col1 con visibilidad correcta

### Paso 2: Crear módulos logged-in
- Extraer contenido logged-in a componentes separados
- Importar y usar condicionalmente

### Paso 3: Verificar y probar
- Asegurar que solo hay 2 columnas en desktop
- Verificar visibilidad en mobile vs desktop
- Verificar que contenido logged-in se muestra correctamente


