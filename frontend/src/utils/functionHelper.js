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

  const camelCase = (str) => {
    const words = str.split(' ');
    const capitalizeWords = words
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

    return capitalizeWords.charAt(0).toLowerCase() + capitalizeWords.slice(1);
  };

  return { isActiveRender, camelCase };
};
