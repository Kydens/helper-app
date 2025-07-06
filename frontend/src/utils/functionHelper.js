import { h, resolveComponent } from 'vue';

export const functionHelper = () => {
  const isActiveRender = (value) => {
    const Icon = resolveComponent('Icon');
    if (value === true || value === 1) {
      return h(
        'span',
        {
          class:
            'inline-flex items-center gap-1 text-green-600 text-xs font-semibold',
        },
        [h(Icon, { name: 'material-symbols:check-circle' }), 'Aktif']
      );
    } else if (value === false || value === 2) {
      return h(
        'span',
        {
          class:
            'inline-flex items-center gap-1 text-red-600 text-xs font-semibold',
        },
        [h(Icon, { name: 'material-symbols:cancel' }), 'Tidak Aktif']
      );
    } else {
      return h(
        'span',
        {
          class:
            'inline-flex items-center gap-1 text-amber-600 text-xs font-semibold',
        },
        [h(Icon, { name: 'material-symbols:help' }), 'Tidak Diketahui']
      );
    }
  };

  return { isActiveRender };
};
