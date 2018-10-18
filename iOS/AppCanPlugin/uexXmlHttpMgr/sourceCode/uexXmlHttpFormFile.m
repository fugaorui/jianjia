/**
 *
 *	@file   	: uexXmlHttpFormFile.m  in EUExXmlHttpMgr
 *
 *	@author 	: CeriNo 
 * 
 *	@date   	: Created on 16/5/23.
 *
 *	@copyright 	: 2016 The AppCan Open Source Project.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

#import "uexXmlHttpFormFile.h"
#import "uexXmlHttpHelper.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <AppCanKit/AppCanKit.h>
@interface uexXmlHttpFormFile(){
    dispatch_semaphore_t _lock;
}


#define Lock() dispatch_semaphore_wait(self->_lock, DISPATCH_TIME_FOREVER)
#define Unlock() dispatch_semaphore_signal(self->_lock)

@property (nonatomic,strong,readwrite)NSString *MIMEType;
@property (nonatomic,strong,readwrite)NSString *fileName;
@property (nonatomic,strong)NSString *filePath;
@property (nonatomic,strong)UIImage *imageToEdit;
@property (nonatomic,strong)NSData *editedData;
@end;


@implementation uexXmlHttpFormFile


- (instancetype)initWithFilePath:(NSString *)filePath
{
    self = [super init];
    if (self) {
        _filePath = filePath;
        _MIMEType = [uexXmlHttpHelper MIMETypeForPathExtension:filePath.pathExtension];
        _fileName = filePath.lastPathComponent;
        _lock = dispatch_semaphore_create(1);
        if([filePath hasPrefix:@"assets-library"]){
            [self fetchAssetImageWithURL:[NSURL URLWithString:filePath]];
        }
    }
    return self;
}




- (void)fetchAssetImageWithURL:(NSURL *)URL{
    if (!URL) {
        return;
    }
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        Lock();
        ALAssetsLibrary *library = [[ALAssetsLibrary alloc]init];
        [library assetForURL:URL resultBlock:^(ALAsset *asset) {
            ALAssetRepresentation *representation = [asset defaultRepresentation];
            self.imageToEdit = [UIImage imageWithCGImage:representation.fullResolutionImage];
            self.fileName = representation.filename;
            Unlock();
        } failureBlock:^(NSError *error) {
            ACLogWarning(@"fetch asset image error:%@",error.localizedDescription);
            Unlock();
        }];
    });
}
- (NSData *)fileData{
    NSData *fileData = nil;
    Lock();
    if (self.imageToEdit) {
        fileData = UIImageJPEGRepresentation(self.imageToEdit, 0.6);
        self.MIMEType = [uexXmlHttpHelper MIMETypeForPathExtension:@"jpg"];
    }
    if (!fileData) {
        fileData = [NSData dataWithContentsOfFile:self.filePath];
    }
    Unlock();
    return fileData;
}


@end
