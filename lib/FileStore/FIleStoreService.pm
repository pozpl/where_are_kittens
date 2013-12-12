package FileStore::FileStoreService;

use Moose;
use File::DigestStore;

has 'root_path' => {
    'is' => 'ro',
    'isa' => 'Str',
}

has 'url_base' => {
    'is' => 'ro',
    'isa' => 'Str',
};

has 'store_provider' => {
    'is' => 'ro',
    'isa' => 'File::DigestStore'
}

sub store_file(){
    my($self, $path) = @_;

    my $id = $self->store_provider->store_path($path);
    return $id;
}

sub get_file_path(){
    my($self, $id) = @_;

    return $self->store_provider->fetch_file($id);
}

sub get_url_for_id(){
    my($self, $id) = @_;

    my $file_path = $self->store_provider->fetch_file($id);
    my $url = qr/$file_path/$self->root_path/$self->url_base;

    return $url;
}


sub get_urls_for_ids(){
    my ($self, $ids_aref) = @_;

    my @urls = [];
    foreach my $id (@{$ids_aref}){
        push @urls, $self->get_url_for_id($id);
    }

    return @urls;
}

1;