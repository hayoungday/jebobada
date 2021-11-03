# -*- mode: python ; coding: utf-8 -*-


block_cipher = None

added_files = [('JBExtractor_v1.1.ui', '.'),
			   ('jb_loading.ui', '.'),
			   ('jb_help_step1.ui', '.'),
			   ('jb_help_step2.ui', '.'),
			   ('jb_warning_step1_1.ui', '.'),
			   ('jb_warning_step1_2.ui', '.'),
			   ('jb_warning_step1_3.ui', '.'),
			   ('KakaoTalk_20211013_182550222.ico','.')]

a = Analysis(['JBExtractor_v1.1.py'],
             pathex=['C:\\Users\\JH\\Desktop\\JB_UI'],
             binaries=[],
             datas=added_files,
             hiddenimports=[],
             hookspath=[],
             hooksconfig={},
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)

exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,  
          [],
		  icon='C:\\Users\\JH\\Desktop\\JB_UI\\KakaoTalk_20211013_182550222.ico',
          name='JBExtractor',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=False,
          disable_windowed_traceback=False,
          target_arch=None,
          codesign_identity=None,
          entitlements_file=None )
