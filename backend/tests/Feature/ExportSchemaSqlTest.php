<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ExportSchemaSqlTest extends TestCase
{
    public function test_writes_mysql_tables_migration_records_and_the_admin(): void
    {
        $path = storage_path('framework/testing/schema.sql');
        $default = DB::getDefaultConnection();
        config(['leads.admin.name' => "O'Brien", 'database.connections.mysql.host' => '192.0.2.1']);

        try {
            $this->artisan('deploy:schema-sql', ['path' => $path])->assertSuccessful();
        } finally {
            DB::setDefaultConnection($default);
        }

        $sql = File::get($path);
        File::delete($path);

        $this->assertStringContainsString('create table `submissions`', $sql);
        $this->assertStringContainsString('`details` json null', $sql);
        $this->assertStringContainsString('on delete cascade', $sql);
        $this->assertStringContainsString("('2026_09_22_000002_create_submission_photos_table', 1)", $sql);

        // Visitor-controlled text is hex-encoded; the hash is a real bcrypt hash.
        $this->assertStringContainsString("_utf8mb4 X'".bin2hex("O'Brien")."'", $sql);
        $this->assertStringContainsString("'owner@example.com'", $sql);
        preg_match("/X'([0-9a-f]+)', '20/", $sql, $hash);
        $this->assertTrue(Hash::check('a-long-test-password', hex2bin($hash[1])));
    }
}
