// Hand-off for the exercise picker modal: the opener registers a callback, the
// picker invokes it with the chosen exercise id and closes itself.
type Pick = (exerciseId: string) => void | Promise<void>;
let pending: { fn: Pick; title: string; allowArchived: boolean } | null = null;

export function setPickerTarget(fn: Pick, title = 'Add exercise', allowArchived = false) {
  pending = { fn, title, allowArchived };
}
export function pickerTarget() {
  return pending;
}
export function clearPickerTarget() {
  pending = null;
}
