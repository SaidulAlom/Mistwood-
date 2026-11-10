/* ============================================================
   Custom cursor — dot + ring that grows and shows VIEW / EAT.
   ============================================================ */

export default function Cursor() {
  return (
    <>
      <div className="cursor-ring" aria-hidden="true"><span className="cursor-label"></span></div>
      <div className="cursor-dot" aria-hidden="true"></div>
    </>
  );
}
