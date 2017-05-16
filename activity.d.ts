export declare class AndroidActivity extends android.app.Activity {
    constructor();
    private _callbacks;
    protected onCreate(savedInstanceState: android.os.Bundle): void;
    protected onSaveInstanceState(outState: android.os.Bundle): void;
    protected onStart(): void;
    protected onStop(): void;
    protected onDestroy(): void;
    onBackPressed(): void;
    onRequestPermissionsResult(requestCode: number, permissions: Array<String>, grantResults: Array<number>): void;
    protected onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void;
}
