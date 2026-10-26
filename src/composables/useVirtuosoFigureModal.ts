import { shallowRef } from 'vue'
import type { VirtuosoFigure } from '@/data/personalityVirtuosoLane'

const selectedFigure = shallowRef<VirtuosoFigure | null>(null)

export function useVirtuosoFigureModal() {
    function openFigure(figure: VirtuosoFigure) {
        selectedFigure.value = figure
    }

    function closeFigure() {
        selectedFigure.value = null
    }

    return { selectedFigure, openFigure, closeFigure }
}
